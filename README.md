🌸 MeterFlow — Usage-Based API Billing & Metering Platform
📌 Project Overview
MeterFlow is a SaaS platform that allows developers to:

✅ Create and manage APIs
✅ Generate secure API keys
✅ Track usage per request in real-time
✅ Apply rate limiting (per minute & per day)
✅ Calculate billing based on usage
✅ Generate invoices automatically


🧱 Tech Stack
LayerTechnologyBackendPython, FastAPI, SQLAlchemyDatabaseSQLite (aiosqlite)AuthJWT (python-jose)FrontendReact, Vite, TailwindCSSChartsRechartsUI StyleGlassmorphic + Floral Design

🏗️ System Architecture
User → Register/Login → JWT Token
     → Create API → Get API Key
     → Hit Gateway → Log Request
     → Track Usage → Calculate Bill
     → Generate Invoice

📁 Project Structure
meterflow2/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── api/                 # Route handlers
│   │   │   ├── auth.py          # Register, Login, Me
│   │   │   ├── apis.py          # API CRUD
│   │   │   ├── keys.py          # API Key management
│   │   │   ├── usage.py         # Usage stats
│   │   │   └── billing.py       # Billing & invoices
│   │   ├── core/
│   │   │   ├── config.py        # App settings
│   │   │   ├── database.py      # SQLite connection
│   │   │   └── security.py      # JWT + hashing
│   │   ├── models/
│   │   │   └── models.py        # SQLAlchemy models
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic schemas
│   │   └── services/            # Business logic
│   ├── requirements.txt
│   └── .env
└── frontend/
    └── src/
        ├── pages/               # Dashboard, APIs, Keys, Usage, Billing
        ├── components/ui/       # Reusable UI components
        ├── hooks/               # useAuth hook
        ├── utils/               # API client (axios)
        └── styles/              # Global CSS + Glassmorphic styles

🚀 Getting Started
Prerequisites

Python 3.11
Node.js 18+

Backend Setup
bashcd backend

# Create virtual environment
py -3.11 -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload
Backend runs at → http://127.0.0.1:8000
API Docs at → http://127.0.0.1:8000/docs
Frontend Setup
bashcd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
Frontend runs at → http://localhost:5173

🔁 Core Flow

User signs up → Creates an account
Creates an API → Defines rate limits and pricing
Gets an API key → Secure mf_live_ prefixed key
End users hit the API → Gateway validates the key
System logs every request → Usage is tracked
Billing is calculated → Based on request count
Invoice is generated → Ready to pay


💳 Billing Plans
PlanPriceFree RequestsFree$01,000/monthPro$0.50 per 1k requestsUnlimitedEnterprise$0.20 per 1k requestsUnlimited

🌸 Features

JWT Authentication — Secure register & login
API Management — Create, update, delete APIs
Key Generation — Secure API keys with mf_live_ prefix
Rate Limiting — Per minute and per day limits
Usage Analytics — Real-time charts and stats
Billing System — Auto-calculate monthly costs
Invoice Generation — One-click invoice creation
Beautiful UI — Floral glassmorphic design


📸 Screenshots

Dashboard with real-time usage stats and charts


API management with rate limit controls


API key generation and management


Billing summary with invoice history


👩‍💻 Author
Built with 🌸 as an internship project
Inspired by Stripe · RapidAPI · AWS API Gateway

📄 License
MIT License
