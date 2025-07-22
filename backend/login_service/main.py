from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from login_service.api import google_oauth

app = FastAPI(
    title="Login Service",
    version="1.0.0",
    description="Handles Google OAuth and WhatsApp Web login"
)

# Register routes
app.include_router(google_oauth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
