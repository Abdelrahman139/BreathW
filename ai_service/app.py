import os
import io
import cv2
import base64
import json
import numpy as np
from PIL import Image
import hashlib
import random

import torch
import torch.nn as nn
import torchvision
from torchvision import transforms
import torchvision.transforms.functional as TF

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
    "cardiomegaly",
    "pneumothorax",
    "noFinding"
]

DEVICE = "cpu"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEIGHTS_PATH = os.path.join(BASE_DIR, "weights", "densenet121.pt")
THRESHOLDS_PATH = os.path.join(BASE_DIR, "weights", "optimal_thresholds.json")

# ==========================================
# 2. IMAGE PREPROCESSING
# ==========================================
def preprocess_image(image_bytes: bytes) -> torch.Tensor:
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
    model = torchvision.models.densenet121(pretrained=False)
    # Upgrade to 5 classes
    model.classifier = nn.Linear(1024, 5)
    
    if os.path.exists(weights_path):
        model.load_state_dict(torch.load(weights_path, map_location=device))
    else:
        print(f"WARNING: Weights file {weights_path} not found. Running with random weights for testing.")
    
    model.to(device)
    model.eval()
    return model

def load_thresholds(thresholds_path=THRESHOLDS_PATH):
    default_thresholds = {cond: 0.5 for cond in CONDITIONS}
    if os.path.exists(thresholds_path):
        with open(thresholds_path, 'r') as f:
            data = json.load(f)
            # Map Kaggle Capitalized labels to our snake_case keys
            mapping = {
                'Pneumonia': 'pneumonia',
                'Effusion': 'effusion',
                'Cardiomegaly': 'cardiomegaly',
                'Pneumothorax': 'pneumothorax',
                'No Finding': 'noFinding'
            }
            for k, v in data.items():
                if k in mapping:
                    default_thresholds[mapping[k]] = float(v)
    return default_thresholds

def predict(model, input_tensor, thresholds, device="cpu"):
    input_tensor = input_tensor.to(device)
    
    with torch.no_grad():
        # Test-Time Augmentation (TTA)
        # 1. Original Image Prediction
        outputs1 = model(input_tensor)
        probs1 = torch.sigmoid(outputs1)[0].cpu().numpy()
        
        # 2. Horizontally Flipped Prediction
        input_flipped = TF.hflip(input_tensor)
        outputs2 = model(input_flipped)
        probs2 = torch.sigmoid(outputs2)[0].cpu().numpy()
        
        # 3. Slightly Rotated Prediction
        input_rotated = TF.rotate(input_tensor, 10)
        outputs3 = model(input_rotated)
        probs3 = torch.sigmoid(outputs3)[0].cpu().numpy()
        
        # Average the predictions
        avg_probs = (probs1 + probs2 + probs3) / 3.0
        
    result = {}
    max_disease_prob = 0.0
    for i, condition in enumerate(CONDITIONS):
        prob_val = float(avg_probs[i])
        if condition != "noFinding":
            max_disease_prob = max(max_disease_prob, prob_val)
        result[condition] = prob_val
        result[f"{condition}_detected"] = bool(prob_val > thresholds[condition])
    
    # Override noFinding: derive it as 1 - max(disease_prob)
    # The raw sigmoid for "No Finding" is unreliable because it's the absence
    # of visual features, not a learnable pattern. This formula is clinically correct.
    result["noFinding"] = max(0.0, 1.0 - max_disease_prob)
    result["noFinding_detected"] = bool(result["noFinding"] > thresholds.get("noFinding", 0.5))
            
    return result

# ==========================================
# 4. GRAD-CAM EXPLAINABILITY
# ==========================================
def generate_heatmap(model, input_tensor, image_bytes, top_condition_idx):
    orig_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    orig_img = orig_img.resize((224, 224))
    rgb_img = np.float32(orig_img) / 255.0
    
    target_layers = [model.features.denseblock4]
    cam = GradCAM(model=model, target_layers=target_layers)
    targets = [ClassifierOutputTarget(top_condition_idx)]
    
    grayscale_cam = cam(input_tensor=input_tensor, targets=targets)
    grayscale_cam = grayscale_cam[0, :]
    
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
app = FastAPI(title="Chest X-Ray AI Service (5-Class + TTA)")

model = load_model(weights_path=WEIGHTS_PATH, device=DEVICE)
optimal_thresholds = load_thresholds(thresholds_path=THRESHOLDS_PATH)

def verify_internal_key(authorization: str = Header(default=None)):
    if not authorization or authorization != "internal-key":
        raise HTTPException(status_code=403, detail="Forbidden: Invalid or missing Authorization header")
    return authorization

@app.get("/health")
def health_check():
    return {"status": "ok", "model": "densenet121_5class"}

@app.post("/predict", dependencies=[Depends(verify_internal_key)])
async def predict_endpoint(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PNG and JPG are supported.")
        
    image_bytes = await file.read()
    
    try:
        input_tensor = preprocess_image(image_bytes)
        scores = predict(model, input_tensor, optimal_thresholds, device=DEVICE)
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
        scores = predict(model, input_tensor, optimal_thresholds, device=DEVICE)
        
        # Filter out the boolean '_detected' fields to find the top condition score
        disease_scores = {k: v for k, v in scores.items() if not k.endswith('_detected') and k != "noFinding"}
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
