from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field, field_validator

from app.config.settings import settings
from app.infrastructure.auth.service import auth_service

router = APIRouter(prefix="/api", tags=["auth"])
security = HTTPBearer(auto_error=False)


class RegisterRequest(BaseModel):
    email: str
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=1)
    role: str = "viewer"

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if "@" not in value:
            raise ValueError("Invalid email")
        return value.lower()


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if "@" not in value:
            raise ValueError("Invalid email")
        return value.lower()


class RefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


@router.post("/auth/register")
def register(body: RegisterRequest, response: Response):
    tokens = auth_service.register(body.email, body.password, body.full_name, body.role)
    set_refresh_cookie(response, tokens["refresh_token"])
    return public_token_response(tokens)


@router.post("/auth/login")
def login(body: LoginRequest, response: Response):
    tokens = auth_service.login(body.email, body.password)
    set_refresh_cookie(response, tokens["refresh_token"])
    return public_token_response(tokens)


@router.get("/auth/oauth/{provider}")
def oauth_redirect(provider: str):
    payload = auth_service.oauth_login(provider)
    return RedirectResponse(payload["authorization_url"])


@router.get("/auth/oauth/{provider}/callback")
def oauth_callback(provider: str, code: str, response: Response):
    tokens = auth_service.oauth_callback(provider, code)
    set_refresh_cookie(response, tokens["refresh_token"])
    return RedirectResponse(f"{settings.frontend_url}/auth/callback?token={tokens['access_token']}")


@router.post("/auth/refresh", response_model=RefreshResponse)
def refresh(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    return auth_service.refresh_access_token(refresh_token)


@router.post("/auth/logout")
def logout(request: Request, response: Response):
    auth_service.logout(request.cookies.get("refresh_token"))
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}


@router.get("/auth/verify-email")
def verify_email(token: str):
    return {"status": "verified", "token": token, "mode": "demo"}


async def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing bearer token")
    payload = auth_service.decode_access_token(credentials.credentials)
    return auth_service.profile_for_user(payload["sub"])


@router.get("/users/me")
def me(current_user: dict = Depends(get_current_user)):
    return current_user


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    secure = settings.environment == "production"
    response.set_cookie(
        "refresh_token",
        refresh_token,
        httponly=True,
        secure=secure,
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        path="/",
    )


def public_token_response(tokens: dict) -> dict:
    return {
        "access_token": tokens["access_token"],
        "token_type": "bearer",
        "expires_in": tokens["expires_in"],
        "user": tokens["user"],
        "role": tokens["role"],
        "workspace_id": tokens["workspace_id"],
    }
