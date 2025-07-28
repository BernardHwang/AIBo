from fastapi import APIRouter, HTTPException, Request
import httpx
from datetime import datetime, timedelta
import pytz

from shared.utils import create_uuid
from shared.db.mongo_client import users

router = APIRouter(prefix="/user/google", tags=["Google Auth"])

@router.post("/login")
async def google_auth(request: Request):
    data = await request.json()
    authentication = data.get("authentication")

    access_token = authentication.get("accessToken")
    id_token = authentication.get("idToken")
    refresh_token = authentication.get("refreshToken")
    expires_in = authentication.get("expiresIn")

    if not access_token:
        raise HTTPException(status_code=400, detail="Missing access token")

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )

        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid access token")

        profile = response.json()
        google_id = profile["id"]
        email = profile["email"]
        name = profile.get("name")
        picture = profile.get("picture")

        # Make this async
        existing_user = await users.find_one({"email": email})
        if existing_user:
            user_uuid = existing_user["_id"]
        else:
            user_uuid = create_uuid()

        expires_at = datetime.now(tz=pytz.timezone("Asia/Kuala_Lumpur")) + timedelta(seconds=expires_in or 3600)

        # Also async
        await users.update_one(
            {"_id": user_uuid},
            {
                "$set": {
                    "email": email,
                    "google": {
                        "id": google_id,
                        "name": name,
                        "picture": picture,
                        "access_token": access_token,
                        "refresh_token": refresh_token,
                        "id_token": id_token,
                        "expires_at": expires_at
                    },
                    "updated_at": datetime.now(tz=pytz.timezone("Asia/Kuala_Lumpur"))
                },
                "$setOnInsert": {
                    "created_at": datetime.now(tz=pytz.timezone("Asia/Kuala_Lumpur"))
                }
            },
            upsert=True
        )

        return {"uuid": user_uuid, "email": email}

    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Google request failed: {e}")
