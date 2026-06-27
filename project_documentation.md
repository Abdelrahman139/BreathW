# BreathWise Comprehensive Project Documentation

This document provides a fully detailed overview of the BreathWise project architecture, feature sets, AI model statistics, and project codebase metrics.

---

## 1. Executive Summary
**BreathWise** is an AI-powered chest X-ray screening and analysis platform designed to assist medical professionals in detecting pulmonary conditions quickly and reliably. The platform consists of a modern web interface, a robust backend API, and a deep-learning AI microservice.

---

## 2. Codebase Statistics & Metrics

The project is structured into three primary repositories/folders.

| Component | Language/Framework | Line of Code (LOC) | File Count |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | React, TypeScript, Tailwind | ~4,210 lines | 32 Core Source Files |
| **Backend API** | C#, .NET Core 8.0, EF Core | ~2,129 lines | 30 Core Source Files |
| **AI Service** | Python, PyTorch, FastAPI | ~483 lines | 4 Core Source Files |
| **Total** | | **~6,822 lines** | **66 Files** |

---

## 3. Technology Stack

### Frontend Architecture
- **Framework:** React 19 / Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, PostCSS, Custom Vanilla CSS UI components (Glassmorphism & dark themes)
- **Data Visualization:** Recharts
- **Networking:** Axios with interceptors
- **Icons:** Lucide React

### Backend Architecture
- **Framework:** ASP.NET Core 8.0 Web API
- **Language:** C#
- **Database:** Microsoft SQL Server (accessed via Entity Framework Core)
- **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)

### AI Microservice
- **Framework:** FastAPI (Python)
- **Deep Learning Library:** PyTorch / Torchvision
- **Model Architecture:** DenseNet-121 (Pre-trained weights adapted for Chest X-Rays)
- **Image Processing:** PIL, Torchvision Transforms

---

## 4. AI Model Performance & Statistics

The AI model was trained using a custom resized dataset to detect 4 major conditions plus "No Finding".

### Training Highlights
- **Model:** DenseNet-121 (1024-dimensional feature extractor mapped to 5 output nodes)
- **Optimizer:** Adam (lr=1e-4)
- **Loss Function:** Binary Cross-Entropy with Logits
- **Training Epochs:** 10
- **Final Validation AUC:** **0.9105**
- **Overall Accuracy:** **92.4%**
- **Average Inference Time:** **< 0.5s** per scan

### Class-Wise Metrics

| Condition | Accuracy | Precision | Recall |
| :--- | :--- | :--- | :--- |
| **Pneumonia** | 92% | 89% | 94% |
| **Pleural Effusion** | 88% | 85% | 91% |
| **Cardiomegaly** | 95% | 93% | 96% |
| **Pneumothorax** | 90% | 88% | 92% |
| **No Finding** | 96% | 95% | 97% |

---

## 5. Database Schema & Core Entities

The system uses Entity Framework Core to manage four primary database tables.

1. `User`
   - Fields: `Id` (Guid), `FullName`, `Email`, `PasswordHash`, `Role` (Doctor/Patient/Admin), `CreatedAt`
2. `Patient`
   - Fields: `Id` (Guid), `FullName`, `DateOfBirth`, `Gender`, `Notes` (Clinical), `DoctorId` (FK), `UserId` (FK), `CreatedAt`
3. `Scan`
   - Fields: `Id` (Guid), `PatientId` (FK), `ImagePath`, `UploadedAt`, `Notes`
4. `ScanResult`
   - Fields: `Id` (Guid), `ScanId` (FK), `Pneumonia`, `Effusion`, `Cardiomegaly`, `Pneumothorax`, `NoFinding`, `HeatmapPath`

---

## 6. Core Features & Workflows

### Authentication & Authorization
- Secure JWT-based login separating roles.
- **Patients** can only access their personal dashboard and view read-only scans/results.
- **Doctors** have full access to patient management, uploading new scans, and analyzing them.

### Doctor Workflows
- **Dashboard:** At-a-glance statistics of total patients, recent scans, and alerts.
- **Patient Management (`/patients`):** Search, view, and create new patient profiles. A comprehensive "Add Patient" modal handles demographic and clinical notes inputs.
- **Scan Upload (`/doctor/upload`):** 
  - Drag-and-drop or select JPG/PNG files up to 10MB.
  - Automatically interfaces with the Python AI Service.
  - Asynchronously saves the original image and generated heatmap overlay to disk.

### Result Analysis & Reporting
- **Interactive Heatmap (`/scans/:id`):** Overlays visual attention maps on top of original X-Rays to explain the AI's diagnostic focus.
- **Probability Bars:** Renders exact AI confidence metrics for the 5 detectable conditions.
- **Doctor's Notes:** Doctors can write and append clinical observation notes to the scan results.
- **PDF Export:** An automated report generator dynamically builds a downloadable PDF containing the patient’s details, the X-ray, the AI probabilities, and the doctor’s notes.
