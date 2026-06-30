# BreathW - AI-Powered X-Ray Analysis Platform

BreathW is a comprehensive, modern web application designed for analyzing chest X-rays using advanced AI models. It features a React-based frontend for an intuitive user experience, a robust .NET Core backend for data management, and a Python-based AI service utilizing PyTorch (DenseNet121) for accurate medical image analysis.

## 🌟 Key Features

- **AI-Powered Diagnostics:** Fast and accurate analysis of chest X-rays to detect multiple conditions.
- **Visual Heatmaps:** Generates Gradient-weighted Class Activation Mapping (Grad-CAM) heatmaps to explain the AI's predictions and highlight areas of interest on the X-rays.
- **Patient Management:** Secure handling of patient records, scan histories, and doctor notes.
- **Model Performance Metrics:** Dedicated dashboard for AI performance, statistics, and accuracy metrics.
- **Modern User Interface:** Built with React, TailwindCSS, and Lucide React icons for a responsive, sleek, and dark-themed UI.

---

## 🏗️ Project Architecture

The application is structured into three main components:

1. **`frontend/`**: The client-side application built with React, Vite, and TailwindCSS.
2. **`backend/XRayAPI/`**: The core API layer built with C# and ASP.NET Core API, using Entity Framework Core and SQL Server for data persistence.
3. **`ai_service/`**: The machine learning microservice built with Python and FastAPI, serving the PyTorch model for predictions and heatmap generation.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
- [Python](https://www.python.org/downloads/) (3.9 or higher)
- Git

---

## 🚀 Installation & Setup Guide

### 1. AI Model Service (Python)
The AI service is responsible for handling image processing and predictions.

```bash
# Navigate to the AI service directory
cd ai_service

# Create and activate a virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install required Python dependencies
pip install -r requirements.txt

# Run the FastAPI AI Service
python app.py
```
*Note: The AI service runs on `http://localhost:8000` by default. It requires the `densenet121.pt` model weights inside the `weights/` directory (included in the repo).*

### 2. Backend API (.NET Core)
The backend API handles authentication, patient data, and scan metadata, and communicates with the AI service.

```bash
# Open a new terminal window and navigate to the backend directory
cd backend/XRayAPI

# Restore the .NET dependencies
dotnet restore

# Apply database migrations to create the SQL Server database
dotnet ef database update

# Run the Backend Server
dotnet run
```
*Note: The backend API usually runs on `http://localhost:5169` or `https://localhost:7198` (check your console output). The API endpoints manage communication with both the database and the Python AI service.*

### 3. Frontend Web App (React)
The frontend provides the user interface for doctors and medical staff.

```bash
# Open a third terminal window and navigate to the frontend directory
cd frontend

# Install Node modules
npm install

# Start the Vite development server
npm run dev
```
*Note: The frontend will typically run on `http://localhost:5173`. Make sure the backend and AI service are already running before using the app to avoid connection errors.*

---

## 💻 How to Use the Application

1. **Start all three services** using the commands above in separate terminal windows.
2. Open your browser and navigate to `http://localhost:5173` (or the URL provided by Vite).
3. Log in using the platform credentials (the default environment allows testing).
4. Navigate to the **New Scan** or **Upload** section to upload a chest X-Ray image.
5. Wait for the AI model to process the image. The results will display the detected conditions, confidence percentages, and an interactive Grad-CAM heatmap highlighting the affected lung regions.
6. Use the **Patients** dashboard to view past scans, manage records, and add doctor notes.

---

## 📝 Technologies Used

**Frontend:**
- React (TypeScript)
- Vite
- TailwindCSS
- React Router
- Axios
- Recharts

**Backend:**
- C# .NET 8.0
- ASP.NET Core Web API
- Entity Framework Core
- Microsoft SQL Server

**AI Service:**
- Python
- PyTorch (DenseNet121)
- FastAPI
- OpenCV & PIL
