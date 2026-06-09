from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import uuid4

from fastapi import HTTPException, status

from app.config.settings import settings
from app.infrastructure.demo.operating_data import USERS
from app.infrastructure.storage import store

ROLE_ALIASES = {
    "pm": "product_manager",
    "em": "engineering_manager",
    "developer": "engineer",
}


@dataclass(frozen=True)
class AuthUser:
    id: str
    email: str
    full_name: str
    role: str
    workspace_id: str
    title: str
    is_verified: bool = True
    is_active: bool = True


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def iso(dt: datetime) -> str:
    return dt.isoformat()


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def secret_key() -> bytes:
    return settings.jwt_secret.encode("utf-8")


def hash_password(password: str, salt: str | None = None) -> str:
    salt = salt or secrets.token_hex(16)
    derived = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120_000)
    return f"pbkdf2_sha256${salt}${b64url(derived)}"


def verify_password(password: str, encoded: str | None) -> bool:
    if not encoded:
        return False
    try:
        scheme, salt, expected = encoded.split("$", 2)
    except ValueError:
        return False
    if scheme != "pbkdf2_sha256":
        return False
    actual = hash_password(password, salt).split("$", 2)[2]
    return hmac.compare_digest(actual, expected)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


class AuthService:
    def __init__(self) -> None:
        self.path = store.path
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.initialize()

    def connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row
        return conn

    def initialize(self) -> None:
        with self.connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS auth_users (
                    id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    hashed_password TEXT,
                    full_name TEXT NOT NULL,
                    avatar_url TEXT,
                    provider TEXT DEFAULT 'email',
                    provider_id TEXT,
                    is_verified INTEGER DEFAULT 1,
                    is_active INTEGER DEFAULT 1,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS auth_workspaces (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    slug TEXT UNIQUE NOT NULL,
                    owner_id TEXT,
                    plan TEXT DEFAULT 'free',
                    created_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS auth_workspace_members (
                    id TEXT PRIMARY KEY,
                    workspace_id TEXT NOT NULL,
                    user_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    invited_by TEXT,
                    joined_at TEXT NOT NULL,
                    UNIQUE(workspace_id, user_id)
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS auth_refresh_tokens (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    token_hash TEXT UNIQUE NOT NULL,
                    expires_at TEXT NOT NULL,
                    revoked INTEGER DEFAULT 0,
                    created_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS auth_email_verification_tokens (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    token TEXT UNIQUE NOT NULL,
                    expires_at TEXT NOT NULL,
                    used INTEGER DEFAULT 0
                )
                """
            )
            conn.execute("CREATE INDEX IF NOT EXISTS idx_auth_members_workspace ON auth_workspace_members(workspace_id)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_auth_members_user ON auth_workspace_members(user_id)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_auth_refresh_user ON auth_refresh_tokens(user_id)")
            self._seed_demo_users(conn)

    def _seed_demo_users(self, conn: sqlite3.Connection) -> None:
        workspace_id = "ws-demo"
        now = iso(utcnow())
        conn.execute(
            "INSERT OR IGNORE INTO auth_workspaces (id, name, slug, owner_id, plan, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (workspace_id, "SprintPilot Demo Workspace", "demo", "u-founder", "startup", now),
        )
        for user in USERS:
            role = normalize_role(user.role)
            conn.execute(
                """
                INSERT OR IGNORE INTO auth_users (id, email, hashed_password, full_name, provider, is_verified, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, 'email', 1, 1, ?, ?)
                """,
                (user.id, user.email, hash_password("demo123"), user.name, now, now),
            )
            conn.execute(
                """
                INSERT OR IGNORE INTO auth_workspace_members (id, workspace_id, user_id, role, invited_by, joined_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (f"member-{user.id}", workspace_id, user.id, role, "u-founder", now),
            )

    def register(self, email: str, password: str, full_name: str, role: str = "viewer") -> dict[str, Any]:
        normalized_role = normalize_role(role)
        now = iso(utcnow())
        user_id = f"user-{uuid4()}"
        workspace_id = f"ws-{uuid4()}"
        with self.connect() as conn:
            existing = conn.execute("SELECT id FROM auth_users WHERE lower(email) = lower(?)", (email,)).fetchone()
            if existing:
                raise HTTPException(status_code=400, detail="Email already registered")
            conn.execute(
                "INSERT INTO auth_users (id, email, hashed_password, full_name, provider, is_verified, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, 'email', 1, 1, ?, ?)",
                (user_id, email, hash_password(password), full_name, now, now),
            )
            conn.execute(
                "INSERT INTO auth_workspaces (id, name, slug, owner_id, plan, created_at) VALUES (?, ?, ?, ?, 'free', ?)",
                (workspace_id, f"{full_name}'s Workspace", slugify(full_name), user_id, now),
            )
            conn.execute(
                "INSERT INTO auth_workspace_members (id, workspace_id, user_id, role, invited_by, joined_at) VALUES (?, ?, ?, ?, ?, ?)",
                (f"member-{user_id}", workspace_id, user_id, normalized_role, user_id, now),
            )
        return self.login(email=email, password=password)

    def login(self, email: str, password: str) -> dict[str, Any]:
        with self.connect() as conn:
            row = conn.execute("SELECT * FROM auth_users WHERE lower(email) = lower(?)", (email,)).fetchone()
        if not row or not verify_password(password, row["hashed_password"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        if not row["is_active"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")
        return self.issue_tokens(row["id"])

    def oauth_login(self, provider: str) -> dict[str, str]:
        if provider not in {"google", "github"}:
            raise HTTPException(status_code=404, detail="Unsupported OAuth provider")
        return {"authorization_url": f"/api/auth/oauth/{provider}/callback?code=demo-{provider}-code", "provider": provider, "mode": "demo"}

    def oauth_callback(self, provider: str, code: str) -> dict[str, Any]:
        if provider not in {"google", "github"} or not code:
            raise HTTPException(status_code=400, detail="Invalid OAuth callback")
        demo_email = "founder@demo.sprintpilot.ai" if provider == "google" else "dev@demo.sprintpilot.ai"
        return self.issue_tokens(self.get_user_by_email(demo_email)["id"])

    def issue_tokens(self, user_id: str) -> dict[str, Any]:
        user = self.get_user(user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        profile = self.profile_for_user(user_id)
        access_token = self.create_access_token(profile)
        refresh_token = secrets.token_urlsafe(48)
        expires_at = utcnow() + timedelta(days=settings.refresh_token_expire_days)
        now = iso(utcnow())
        with self.connect() as conn:
            conn.execute(
                "INSERT INTO auth_refresh_tokens (id, user_id, token_hash, expires_at, revoked, created_at) VALUES (?, ?, ?, ?, 0, ?)",
                (f"rt-{uuid4()}", user_id, hash_token(refresh_token), iso(expires_at), now),
            )
        return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer", "expires_in": settings.access_token_expire_minutes * 60, "user": profile["user"], "role": profile["role"], "workspace_id": profile["workspace_id"]}

    def refresh_access_token(self, refresh_token: str | None) -> dict[str, Any]:
        if not refresh_token:
            raise HTTPException(status_code=401, detail="No refresh token")
        token_hash = hash_token(refresh_token)
        with self.connect() as conn:
            row = conn.execute("SELECT * FROM auth_refresh_tokens WHERE token_hash = ? AND revoked = 0", (token_hash,)).fetchone()
        if not row or datetime.fromisoformat(row["expires_at"]) <= utcnow():
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
        profile = self.profile_for_user(row["user_id"])
        return {"access_token": self.create_access_token(profile), "token_type": "bearer", "expires_in": settings.access_token_expire_minutes * 60, **profile}

    def logout(self, refresh_token: str | None) -> None:
        if not refresh_token:
            return
        with self.connect() as conn:
            conn.execute("UPDATE auth_refresh_tokens SET revoked = 1 WHERE token_hash = ?", (hash_token(refresh_token),))

    def create_access_token(self, profile: dict[str, Any]) -> str:
        now = utcnow()
        payload = {
            "sub": profile["user"]["id"],
            "email": profile["user"]["email"],
            "role": profile["role"],
            "workspace_id": profile["workspace_id"],
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(minutes=settings.access_token_expire_minutes)).timestamp()),
        }
        header = {"alg": settings.jwt_algorithm, "typ": "JWT"}
        signing_input = f"{b64url(json.dumps(header, separators=(',', ':')).encode())}.{b64url(json.dumps(payload, separators=(',', ':')).encode())}"
        signature = hmac.new(secret_key(), signing_input.encode("utf-8"), hashlib.sha256).digest()
        return f"{signing_input}.{b64url(signature)}"

    def decode_access_token(self, token: str) -> dict[str, Any]:
        try:
            header_part, payload_part, signature_part = token.split(".")
            signing_input = f"{header_part}.{payload_part}"
            expected = b64url(hmac.new(secret_key(), signing_input.encode("utf-8"), hashlib.sha256).digest())
            if not hmac.compare_digest(expected, signature_part):
                raise ValueError("bad signature")
            payload = json.loads(b64url_decode(payload_part))
        except Exception as exc:
            raise HTTPException(status_code=401, detail="Invalid token") from exc
        if int(payload.get("exp", 0)) <= int(utcnow().timestamp()):
            raise HTTPException(status_code=401, detail="Token expired")
        return payload

    def get_user(self, user_id: str) -> sqlite3.Row | None:
        with self.connect() as conn:
            return conn.execute("SELECT * FROM auth_users WHERE id = ?", (user_id,)).fetchone()

    def get_user_by_email(self, email: str) -> sqlite3.Row:
        with self.connect() as conn:
            row = conn.execute("SELECT * FROM auth_users WHERE lower(email) = lower(?)", (email,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        return row

    def profile_for_user(self, user_id: str) -> dict[str, Any]:
        with self.connect() as conn:
            user = conn.execute("SELECT * FROM auth_users WHERE id = ?", (user_id,)).fetchone()
            member = conn.execute("SELECT * FROM auth_workspace_members WHERE user_id = ? ORDER BY joined_at LIMIT 1", (user_id,)).fetchone()
        if not user or not member:
            raise HTTPException(status_code=401, detail="User profile not found")
        role = normalize_role(member["role"])
        profile_user = {
            "id": user["id"],
            "email": user["email"],
            "name": user["full_name"],
            "role": role,
            "title": role_title(role),
            "is_verified": bool(user["is_verified"]),
        }
        return {"user": profile_user, "role": role, "workspace_id": member["workspace_id"]}


def normalize_role(role: str) -> str:
    return ROLE_ALIASES.get(role, role)


def role_title(role: str) -> str:
    return {
        "founder": "Founder / CEO",
        "product_manager": "Product Manager",
        "engineering_manager": "Engineering Manager",
        "engineer": "Backend Engineer",
        "viewer": "Viewer",
    }.get(role, "Viewer")


def slugify(value: str) -> str:
    slug = "".join(char.lower() if char.isalnum() else "-" for char in value).strip("-")
    return f"{slug or 'workspace'}-{secrets.token_hex(3)}"


auth_service = AuthService()
