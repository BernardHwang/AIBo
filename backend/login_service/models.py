from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    uuid: str
    email: EmailStr
    phone_num: str
    password: str  # To hash later

class UserOut(BaseModel):
    id: str
    username: str
    email: EmailStr
