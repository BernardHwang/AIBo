from pydantic import BaseModel, EmailStr
from typing import Optional

class GoogleUserCreate(BaseModel):
    email: EmailStr
    name: str
    picture: str
    token: str

class WhatsAppUpdate(BaseModel):
    phone: str
    whatsapp_verified: bool = True  # optional flag
