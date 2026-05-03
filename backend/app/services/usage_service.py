from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.models import UsageLog, APIKey, User


async def log_request(api_id, api_key_id, user_id, endpoint, method, status_code, response_time_ms, db):
    log = UsageLog(
        api_id=api_id, api_key_id=api_key_id, user_id=user_id,
        endpoint=endpoint, method=method,
        status_code=status_code, response_time_ms=response_time_ms,
    )
    db.add(log)
    result = await db.execute(select(APIKey).where(APIKey.id == api_key_id))
    key_obj = result.scalar_one_or_none()
    if key_obj:
        key_obj.total_requests += 1
        key_obj.last_used_at = datetime.now(timezone.utc)


async def get_usage_stats(user: User, db: AsyncSession) -> dict:
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    hour_start = now.replace(minute=0, second=0, microsecond=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    total = (await db.execute(select(func.count(UsageLog.id)).where(UsageLog.user_id == user.id))).scalar() or 0
    today = (await db.execute(select(func.count(UsageLog.id)).where(UsageLog.user_id == user.id, UsageLog.timestamp >= today_start))).scalar() or 0
    hour = (await db.execute(select(func.count(UsageLog.id)).where(UsageLog.user_id == user.id, UsageLog.timestamp >= hour_start))).scalar() or 0
    month = (await db.execute(select(func.count(UsageLog.id)).where(UsageLog.user_id == user.id, UsageLog.timestamp >= month_start))).scalar() or 0
    avg_rt = (await db.execute(select(func.avg(UsageLog.response_time_ms)).where(UsageLog.user_id == user.id, UsageLog.timestamp >= month_start))).scalar() or 0
    success = (await db.execute(select(func.count(UsageLog.id)).where(UsageLog.user_id == user.id, UsageLog.timestamp >= month_start, UsageLog.status_code < 400))).scalar() or 0

    days_data = []
    for i in range(6, -1, -1):
        day = today_start - timedelta(days=i)
        cnt = (await db.execute(select(func.count(UsageLog.id)).where(
            UsageLog.user_id == user.id,
            UsageLog.timestamp >= day,
            UsageLog.timestamp < day + timedelta(days=1)
        ))).scalar() or 0
        days_data.append({"date": day.strftime("%b %d"), "requests": cnt})

    return {
        "total_requests": total,
        "requests_today": today,
        "requests_this_hour": hour,
        "requests_this_month": month,
        "avg_response_time_ms": round(float(avg_rt), 2),
        "success_rate": round((success / max(month, 1)) * 100, 1),
        "requests_by_day": days_data,
    }
