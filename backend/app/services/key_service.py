import secrets
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from app.models.models import API, APIKey, User
from app.schemas.schemas import APIKeyCreate


def generate_api_key() -> str:
    return f"mf_live_{secrets.token_urlsafe(32)}"


async def create_api_key(api_id: str, data: APIKeyCreate, user: User, db: AsyncSession) -> APIKey:
    result = await db.execute(select(API).where(API.id == api_id, API.owner_id == user.id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="API not found")
    key = APIKey(
        api_id=api_id,
        owner_id=user.id,
        key=generate_api_key(),
        name=data.name,
        expires_at=data.expires_at,
    )
    db.add(key)
    await db.flush()
    return key


async def list_api_keys(api_id: str, user: User, db: AsyncSession) -> list:
    result = await db.execute(
        select(APIKey).where(APIKey.api_id == api_id, APIKey.owner_id == user.id)
        .order_by(APIKey.created_at.desc())
    )
    return result.scalars().all()


async def revoke_api_key(key_id: str, user: User, db: AsyncSession) -> APIKey:
    result = await db.execute(select(APIKey).where(APIKey.id == key_id, APIKey.owner_id == user.id))
    key = result.scalar_one_or_none()
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")
    key.is_active = False
    return key
