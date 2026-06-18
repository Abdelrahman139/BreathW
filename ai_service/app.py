import os
import io
import cv2
import base64
import numpy as np
from PIL import Image

import torch
import torch.nn as nn
import torchvision
from torchvision import transforms

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image

from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Header
import uvicorn

# ==========================================
# 1. CONSTANTS & CONFIGURATION
# ==========================================
CONDITIONS = [
    "pneumonia",
    "effusion",
    "atelectasis",
    "cardiomegaly",
    "pneumothorax"
]

DEVICE = "cpu"
WEIGHTS_PATH = "weights/densenet121.pt"

# ==========================================
# 2. IMAGE PREPROCESSING
# ==========================================
def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    """
    Preprocess raw image bytes for DenseNet-121 model.
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                             std=[0.229, 0.224, 0.225]),
    ])
    
    input_tensor = preprocess(image)
    input_batch = input_tensor.unsqueeze(0)
    return input_batch

# ==========================================
# 3. MODEL DEFINITION & INFERENCE
# ==========================================
def load_model(weights_path=WEIGHTS_PATH, device="cpu"):
    """
    Load the DenseNet-121 model and initialize with trained weights if available.
    """
    model = torchvision.models.densenet121(pretrained=False)
    model.classifier = nn.Linear(1024, 5)
    
    if os.path.exists(weights_path):
        model.load_state_dict(torch.load(weights_path, map_location=device))
    else:
        print(f"Warning: Weights file {weights_path} not found. Using untrained weights for testing.")
    
    model.to(device)
    model.eval()
    return model

def predict(model, input_tensor, device="cpu"):
    """
    Run inference and return confidence scores for the 5 conditions + no_finding.
    """
    input_tensor = input_tensor.to(device)
    
    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.sigmoid(outputs)[0].cpu().numpy()
        
    result = {}
    max_prob = 0.0
    for i, condition in enumerate(CONDITIONS):
        prob_val = float(probs[i])
        result[condition] = prob_val
        if prob_val > max_prob:
            max_prob = prob_val
            
    # Derive 'no_finding' as 1.0 - max(condition probabilities)
    result["no_finding"] = max(0.0, 1.0 - max_prob)
    return result

# ==========================================
# 4. GRAD-CAM EXPLAINABILITY
# ==========================================
def generate_heatmap(model, input_tensor, image_bytes, top_condition_idx):
    """
    Generate a Grad-CAM heatmap overlaid on the original image.
    """
    target_layers = [model.features.denseblock4]
    cam = GradCAM(model=model, target_layers=target_layers)
    targets = [ClassifierOutputTarget(top_condition_idx)]
    
    grayscale_cam = cam(input_tensor=input_tensor, targets=targets)
    grayscale_cam = grayscale_cam[0, :]
    
    orig_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    orig_img = orig_img.resize((224, 224))
    rgb_img = np.float32(orig_img) / 255.0
    
    visualization = show_cam_on_image(
        rgb_img, 
        grayscale_cam, 
        use_rgb=True, 
        colormap=cv2.COLORMAP_JET
    )
    
    vis_img = Image.fromarray(visualization)
    buffered = io.BytesIO()
    vis_img.save(buffered, format="PNG")
    base64_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    return base64_str

# ==========================================
# 5. FASTAPI APPLICATION
# ==========================================
app = FastAPI(title="Chest X-Ray AI Service (Single File)")

# Load model globally
model = load_model(weights_path=WEIGHTS_PATH, device=DEVICE)

def verify_internal_key(authorization: str = Header(default=None)):
    if not authorization or authorization != "internal-key":
        raise HTTPException(status_code=403, detail="Forbidden: Invalid or missing Authorization header")
    return authorization

@app.get("/health")
def health_check():
    return {"status": "ok", "model": "densenet121"}

@app.post("/predict", dependencies=[Depends(verify_internal_key)])
async def predict_endpoint(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PNG and JPG are supported.")
        
    image_bytes = await file.read()
    
    try:
        input_tensor = preprocess_image(image_bytes)
        scores = predict(model, input_tensor, device=DEVICE)
        return scores
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.post("/heatmap", dependencies=[Depends(verify_internal_key)])
async def heatmap_endpoint(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PNG and JPG are supported.")
        
    image_bytes = await file.read()
    
    try:
        input_tensor = preprocess_image(image_bytes)
        scores = predict(model, input_tensor, device=DEVICE)
        
        disease_scores = {k: v for k, v in scores.items() if k != "no_finding"}
        top_condition = max(disease_scores, key=disease_scores.get)
        top_condition_idx = CONDITIONS.index(top_condition)
        
        heatmap_base64 = generate_heatmap(model, input_tensor, image_bytes, top_condition_idx)
        
        return {
            "heatmap_base64": heatmap_base64,
            "top_condition": top_condition
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Heatmap generation error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
