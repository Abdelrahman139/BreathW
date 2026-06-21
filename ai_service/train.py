import os
import pandas as pd
from PIL import Image
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import torchvision
from torchvision import transforms

# Constants
CSV_PATH = "../resized_dataset/resized_labels.csv"
IMAGE_DIR = "../resized_dataset"
TARGET_CONDITIONS = ["Pneumonia", "Effusion", "Cardiomegaly", "Pneumothorax"]
WEIGHTS_DIR = "weights"
WEIGHTS_PATH = os.path.join(WEIGHTS_DIR, "densenet121.pt")
BATCH_SIZE = 32
EPOCHS = 10
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

os.makedirs(WEIGHTS_DIR, exist_ok=True)

class ResizedXRayDataset(Dataset):
    def __init__(self, dataframe, image_dir, transform=None):
        self.dataframe = dataframe
        self.image_dir = image_dir
        self.transform = transform
        self.labels = self.dataframe[TARGET_CONDITIONS].values
        
    def __len__(self):
        return len(self.dataframe)
        
    def __getitem__(self, idx):
        img_rel_path = self.dataframe.iloc[idx]['Path']
        img_path = os.path.join(self.image_dir, img_rel_path)
        image = Image.open(img_path).convert('RGB')
        
        if self.transform:
            image = self.transform(image)
            
        label = torch.FloatTensor(self.labels[idx])
        return image, label

def main():
    print(f"Loading dataset from {CSV_PATH}...")
    df = pd.read_csv(CSV_PATH)
    
    # Split into train/val (80/20)
    train_df = df.sample(frac=0.8, random_state=42)
    val_df = df.drop(train_df.index)
    print(f"Train size: {len(train_df)}, Val size: {len(val_df)}")
    
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    train_dataset = ResizedXRayDataset(train_df, IMAGE_DIR, transform=train_transform)
    val_dataset = ResizedXRayDataset(val_df, IMAGE_DIR, transform=val_transform)
    
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)
    
    print("Building model...")
    # Fix the deprecation warning
    weights = torchvision.models.DenseNet121_Weights.DEFAULT
    model = torchvision.models.densenet121(weights=weights)
    
    # 4 Output classes matching your dataset
    model.classifier = nn.Linear(1024, len(TARGET_CONDITIONS))
    model = model.to(DEVICE)
    
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.Adam(model.parameters(), lr=1e-4)
    
    best_val_loss = float('inf')
    
    for epoch in range(EPOCHS):
        model.train()
        train_loss = 0.0
        for batch_idx, (inputs, labels) in enumerate(train_loader):
            inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item()
            if batch_idx % 50 == 0:
                print(f"Epoch {epoch+1}/{EPOCHS} | Batch {batch_idx}/{len(train_loader)} | Loss: {loss.item():.4f}")
                
        train_loss /= len(train_loader)
        
        # Validation
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                val_loss += loss.item()
        val_loss /= len(val_loader)
        
        print(f"--- Epoch {epoch+1} Summary | Train Loss: {train_loss:.4f} | Val Loss: {val_loss:.4f}")
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), WEIGHTS_PATH)
            print(f"Saved new best model to {WEIGHTS_PATH}!")
            
    print("Training complete!")

if __name__ == "__main__":
    main()
