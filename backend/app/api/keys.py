from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.schemas import APIKeyCreate, APIKeyOut
from app.services.auth_service import get_current_user
from app.services.key_service import create_api_key, list_api_keys, revoke_api_key
from app.models.models import User

router = APIRouter(prefix="/apis/{api_id}/keys", tags=["API Keys"])


@router.post("", response_model=APIKeyOut, status_code=201)
async def create_key(api_id: str, data: APIKeyCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await create_api_key(api_id, data, user, db)


@router.get("", response_model=list[APIKeyOut])
async def list_keys(api_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await list_api_keys(api_id, user, db)


@router.delete("/{key_id}", response_model=APIKeyOut)
async def revoke_key(api_id: str, key_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await revoke_api_key(key_id, user, db)
