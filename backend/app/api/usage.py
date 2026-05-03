from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.services.usage_service import get_usage_stats
from app.models.models import User

router = APIRouter(prefix="/usage", tags=["Usage"])


@router.get("/stats")
async def stats(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_usage_stats(user, db)
