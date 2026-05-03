from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException

from app.models.models import API, APIKey, UsageLog, User
from app.schemas.schemas import APICreate, APIUpdate


async def create_api(data: APICreate, user: User, db: AsyncSession) -> API:
    api = API(
        owner_id=user.id,
        name=data.name,
        description=data.description,
        endpoint_url=data.endpoint_url,
        rate_limit_per_minute=data.rate_limit_per_minute,
        rate_limit_per_day=data.rate_limit_per_day,
        price_per_1k_requests=data.price_per_1k_requests,
    )
    db.add(api)
    await db.flush()
    return api


async def list_user_apis(user: User, db: AsyncSession) -> list:
    result = await db.execute(
        select(API).where(API.owner_id == user.id).order_by(API.created_at.desc())
    )
    apis = result.scalars().all()
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    for api in apis:
        keys_count = await db.execute(select(func.count(APIKey.id)).where(APIKey.api_id == api.id))
        req_today = await db.execute(
            select(func.count(UsageLog.id)).where(
                UsageLog.api_id == api.id, UsageLog.timestamp >= today_start
            )
        )
        api.total_keys = keys_count.scalar()
        api.total_requests_today = req_today.scalar()
    return apis


async def get_api_or_404(api_id: str, user: User, db: AsyncSession) -> API:
    result = await db.execute(select(API).where(API.id == api_id, API.owner_id == user.id))
    api = result.scalar_one_or_none()
    if not api:
        raise HTTPException(status_code=404, detail="API not found")
    return api


async def update_api(api_id: str, data: APIUpdate, user: User, db: AsyncSession) -> API:
    api = await get_api_or_404(api_id, user, db)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(api, field, value)
    return api


async def delete_api(api_id: str, user: User, db: AsyncSession):
    api = await get_api_or_404(api_id, user, db)
    await db.delete(api)
