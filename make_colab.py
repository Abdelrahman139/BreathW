import json

nb = {
    'cells': [
        {
            'cell_type': 'markdown',
            'metadata': {},
            'source': [
                '# Colab Training for BreathWise\\n',
                '1. Upload `colab_dataset.zip` to your Google Drive.\\n',
                '2. Mount your Google Drive by running the cell below.\\n',
                '3. Unzip the dataset and run the training cell.'
            ]
        },
        {
            'cell_type': 'code',
            'execution_count': None,
            'metadata': {},
            'outputs': [],
            'source': [
                'from google.colab import drive\\n',
                'drive.mount("/content/drive")\\n',
                '\\n',
                '# Copy from Drive to local Colab storage (much faster training)\\n',
                '!cp "/content/drive/MyDrive/colab_dataset.zip" /content/\\n',
                '!unzip -q /content/colab_dataset.zip -d /content/dataset/\\n',
                'print("Dataset ready!")'
            ]
        },
        {
            'cell_type': 'code',
            'execution_count': None,
            'metadata': {},
            'outputs': [],
            'source': open('ai_service/train.py').read()
                .replace('../resized_dataset/resized_labels.csv', '/content/dataset/resized_labels.csv')
                .replace('../resized_dataset', '/content/dataset/')
                .replace('num_workers=0', 'num_workers=2')
                .splitlines(True)
        },
        {
            'cell_type': 'markdown',
            'metadata': {},
            'source': [
                '# Evaluate Model Performance\\n',
                'Calculate accuracy, precision, recall, and plot ROC curves for each class.'
            ]
        },
        {
            'cell_type': 'code',
            'execution_count': None,
            'metadata': {},
            'outputs': [],
            'source': [
                'import matplotlib.pyplot as plt\\n',
                'import seaborn as sns\\n',
                'from sklearn.metrics import classification_report, roc_auc_score, roc_curve\\n',
                'import numpy as np\\n',
                '\\n',
                'def evaluate_model(model, val_loader):\\n',
                '    model.eval()\\n',
                '    all_labels = []\\n',
                '    all_preds = []\\n',
                '    \\n',
                '    with torch.no_grad():\\n',
                '        for inputs, labels in val_loader:\\n',
                '            inputs = inputs.to(DEVICE)\\n',
                '            outputs = model(inputs)\\n',
                '            probs = torch.sigmoid(outputs)\\n',
                '            \\n',
                '            all_labels.append(labels.cpu().numpy())\\n',
                '            all_preds.append(probs.cpu().numpy())\\n',
                '            \\n',
                '    all_labels = np.vstack(all_labels)\\n',
                '    all_preds = np.vstack(all_preds)\\n',
                '    \\n',
                '    print("\\n--- Classification Report (Threshold=0.5) ---")\\n',
                '    preds_binary = (all_preds > 0.5).astype(int)\\n',
                '    print(classification_report(all_labels, preds_binary, target_names=TARGET_CONDITIONS))\\n',
                '    \\n',
                '    print("--- ROC AUC Scores ---")\\n',
                '    for i, condition in enumerate(TARGET_CONDITIONS):\\n',
                '        auc = roc_auc_score(all_labels[:, i], all_preds[:, i])\\n',
                '        print(f"{condition}: {auc:.4f}")\\n',
                '        \\n',
                '    # Plot ROC Curves\\n',
                '    plt.figure(figsize=(10, 8))\\n',
                '    for i, condition in enumerate(TARGET_CONDITIONS):\\n',
                '        fpr, tpr, _ = roc_curve(all_labels[:, i], all_preds[:, i])\\n',
                '        auc = roc_auc_score(all_labels[:, i], all_preds[:, i])\\n',
                '        plt.plot(fpr, tpr, label=f"{condition} (AUC = {auc:.4f})")\\n',
                '        \\n',
                '    plt.plot([0, 1], [0, 1], "k--")\\n',
                '    plt.xlim([0.0, 1.0])\\n',
                '    plt.ylim([0.0, 1.05])\\n',
                '    plt.xlabel("False Positive Rate")\\n',
                '    plt.ylabel("True Positive Rate")\\n',
                '    plt.title("ROC Curves per Condition")\\n',
                '    plt.legend(loc="lower right")\\n',
                '    plt.show()\\n',
                '\\n',
                'print("Setting up validation dataset and model for evaluation...")\\n',
                'df = pd.read_csv("/content/dataset/resized_labels.csv")\\n',
                'train_df = df.sample(frac=0.8, random_state=42)\\n',
                'val_df = df.drop(train_df.index)\\n',
                'val_transform = transforms.Compose([\\n',
                '    transforms.Resize((224, 224)),\\n',
                '    transforms.ToTensor(),\\n',
                '    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])\\n',
                '])\\n',
                'val_dataset = ResizedXRayDataset(val_df, "/content/dataset/", transform=val_transform)\\n',
                'val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False, num_workers=2)\\n',
                '\\n',
                'model = torchvision.models.densenet121()\\n',
                'model.classifier = nn.Linear(1024, len(TARGET_CONDITIONS))\\n',
                'model = model.to(DEVICE)\\n',
                '\\n',
                'print("Loading best model weights...")\\n',
                'model.load_state_dict(torch.load(WEIGHTS_PATH))\\n',
                'evaluate_model(model, val_loader)\\n'
            ]
        },
        {
            'cell_type': 'code',
            'execution_count': None,
            'metadata': {},
            'outputs': [],
            'source': [
                '# Copy the trained weights back to your Google Drive!\\n',
                '!cp weights/densenet121.pt "/content/drive/MyDrive/densenet121.pt"\\n',
                'print("Weights saved to Drive!")'
            ]
        }
    ],
    'metadata': {
        'kernelspec': {
            'display_name': 'Python 3',
            'language': 'python',
            'name': 'python3'
        }
    },
    'nbformat': 4,
    'nbformat_minor': 4
}

with open('colab_training.ipynb', 'w') as f:
    json.dump(nb, f, indent=2)

print("Created colab_training.ipynb")
