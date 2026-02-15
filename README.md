# SS MEDICARE System

## 🏥 Vision
A single, scalable, and secure digital platform to unify healthcare data for every citizen, powered by a Unique SS MEDICARE Health ID and AI-driven insights.

## 🏗 Architecture
The system follows a Cloud-Native Microservices architecture:

- **Frontend (Admin Portal)**: Next.js (React) for hospital administrators and doctors.
- **Backend (Core Engine)**: Go (Golang) for high-performance record management.
- **API Gateway**: Node.js (Express) for routing and orchestration.
- **AI Service**: Python (FastAPI + Google Gemini) for medical data analysis.
- **Database**: PostgreSQL (Structured Data) & Cloud Storage (Medical Imaging).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Go (v1.20+) - *Optional for Frontend Demo*
- Python (v3.10+) - *Optional for AI Demo*

### Running the Admin Portal
1. Navigate to the frontend directory:
   ```bash
   cd admin-portal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

### Running the Backend Services
*(Under Development)*
- **Core Backend**: Located in `backend-core/`
- **API Gateway**: Located in `api-gateway/`

## 📅 Development Phases
- **Phase 1**: Foundation (Identity, Data Ingestion, Admin Portal) - *Current Focus*
- **Phase 2**: AI-Assisted Patient Care (Patient Portal, Lab Analysis)
- **Phase 3**: AI Concierge (Triage, Logistics)

---
*Built with ❤️ for the Future of Healthcare*
