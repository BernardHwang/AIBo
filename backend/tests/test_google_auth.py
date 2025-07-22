import pytest
from fastapi.testclient import TestClient
from login_service.main import app

client = TestClient(app)

# Simulate the OAuth token exchange callback
def test_google_oauth_callback(monkeypatch):
    fake_code = "mock_auth_code_from_google"

    # Mock httpx call to Google's token endpoint
    async def fake_post_token(self, url, **kwargs):
        class Response:
            def json(self):
                return {
                    "access_token": "mock_access_token",
                    "expires_in": 3600,
                    "refresh_token": "mock_refresh_token",
                    "scope": "https://www.googleapis.com/auth/userinfo.email",
                    "token_type": "Bearer",
                    "id_token": "mock_id_token"
                }

            def raise_for_status(self): pass

        return Response()

    # Patch httpx.AsyncClient().post to simulate Google's token response
    monkeypatch.setattr("httpx.AsyncClient.post", fake_post_token)

    # Call your callback endpoint with fake code
    response = client.get(f"/auth/google/callback?code={fake_code}")
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["access_token"] == "mock_access_token"
