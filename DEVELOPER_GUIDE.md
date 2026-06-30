# BreathWise Developer Guide

Welcome to the complete developer guide for the BreathWise project. This document serves as a deep dive into the architecture, APIs, and components of the application. 

## 1. System Architecture Overview
The system relies on 3 main services:
- **Frontend App**: React/TypeScript using Vite. Handles the user interactions and displays data visually.
- **Backend API**: ASP.NET Core 8 Web API. Serves as the central data hub connecting the database, frontend, and the AI microservice.
- **AI Microservice**: Python FastAPI server utilizing PyTorch to perform deep learning inferences on Chest X-Rays.

## 2. Backend API Reference (ASP.NET Core)

The backend runs on `https://localhost:7198` or `http://localhost:5169` and interfaces with Microsoft SQL Server. All endpoints except Authentication require a valid JWT Bearer token.

### Authentication Controller (`/api/Auth`)
- `POST /api/Auth/login`: Authenticates a user and returns a JWT token.
- `POST /api/Auth/register`: Registers a new user (Doctor, Patient, Admin).

### Patients Controller (`/api/Patients`)
- `GET /api/Patients`: Returns a list of patients (typically scoped to the requesting doctor).
- `GET /api/Patients/{id}`: Retrieves details of a specific patient.
- `POST /api/Patients`: Creates a new patient record.
- `PUT /api/Patients/{id}`: Updates existing patient details.
- `DELETE /api/Patients/{id}`: Soft deletes or removes a patient.

### Scans Controller (`/api/Scans`)
- `GET /api/Scans/patient/{patientId}`: Retrieves all scans associated with a patient.
- `GET /api/Scans/{id}`: Gets details of a specific scan, including the AI results and heatmap.
- `POST /api/Scans/upload`: Accepts a multipart/form-data upload of an X-Ray image. Communicates with the AI service to generate predictions and heatmaps, then stores the data in SQL Server.
- `GET /api/Scans/export/{id}`: Generates and returns a PDF report of the scan results.

### Dashboard Controller (`/api/Dashboard`)
- `GET /api/Dashboard/stats`: Returns aggregated statistics for the doctor's dashboard (e.g., total patients, total scans, distribution of conditions).

## 3. AI Service API Reference (FastAPI)

The AI service runs on `http://localhost:8000`. It is meant to be internal and requires an `Authorization: internal-key` header to prevent unauthorized access.

- `GET /health`: Returns the health status and loaded model type.
- `POST /predict`: Accepts a multipart/form-data image file. Returns JSON containing probabilities for `pneumonia`, `effusion`, `cardiomegaly`, `pneumothorax`, and `no_finding`.
- `POST /heatmap`: Accepts an image file. Returns the `predict` scores alongside a `heatmap_base64` string containing the Grad-CAM visualization overlay on the original X-Ray.

## 4. Frontend Component Architecture

The frontend is located in `frontend/src/` and follows a component-based architecture:
- **`components/`**: Reusable UI elements (e.g., `ResultCard.tsx`, buttons, inputs).
- **`layout/`**: Structural components like `Navbar.tsx` and `Sidebar.tsx`.
- **`pages/`**: Full page views corresponding to routes (e.g., Dashboard, Login, PatientDetails, UploadScan).
- **`api/`**: Axios client configuration and API service wrappers.
- **`auth/`**: Context providers (e.g., `AuthContext.tsx`) for managing global user state and JWT tokens.
- **`types/`**: TypeScript interface definitions aligning with Backend DTOs and Database models.

## 5. Database Schema Details (Entity Framework Core)

The SQL Server database is managed via EF Core Migrations (`backend/XRayAPI/Migrations`). 

### Key Entities:
- **User**: Stores login credentials, roles, and timestamps.
- **Patient**: Linked to a User (if the patient has login access) and a Doctor (User). Contains medical history notes.
- **Scan**: Represents an uploaded X-Ray image. Linked to a Patient. Stores the file path to the raw image.
- **ScanResult**: One-to-One relationship with a Scan. Stores the exact AI confidence floats for each condition and the file path to the generated heatmap image.

## 6. Developing & Extending the Platform

### Adding a new AI Condition
1. Update `CONDITIONS` list in `ai_service/app.py`.
2. Retrain the DenseNet121 model to output the new number of classes and save the updated `.pt` weights file.
3. Update `ScanResult.cs` in the Backend Models to include a new boolean or float column.
4. Run `dotnet ef migrations add AddNewCondition` and `dotnet ef database update`.
5. Update the Frontend `types/index.ts` and `ResultCard.tsx` to display the new condition.

### Working with the AI Service Locally
If the `densenet121.pt` weights file is missing from `ai_service/weights/`, the Python service will automatically fall back to **DEMO MODE**. In Demo Mode, it uses a deterministic random seed (based on the image hash) to generate fake predictions and dummy heatmaps, allowing Frontend and Backend developers to continue working without needing the large model weights.
