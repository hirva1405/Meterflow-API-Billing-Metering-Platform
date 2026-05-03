from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.schemas import APICreate, APIUpdate, APIOut
from app.services.auth_service import get_current_user
from app.services.api_service import create_api, list_user_apis, get_api_or_404, update_api, delete_api
from app.models.models import User

router = APIRouter(prefix="/apis", tags=["APIs"])


@router.post("", response_model=APIOut, status_code=201)
async def create(data: APICreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await create_api(data, user, db)


@router.get("", response_model=list[APIOut])
async def list_apis(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await list_user_apis(user, db)


@router.get("/{api_id}", response_model=APIOut)
async def get_api(api_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_api_or_404(api_id, user, db)


@router.patch("/{api_id}", response_model=APIOut)
async def update(api_id: str, data: APIUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await update_api(api_id, data, user, db)


@router.delete("/{api_id}", status_code=204)
async def delete(api_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await delete_api(api_id, user, db)
