from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.auth_service import get_current_user
from app.services.billing_service import get_billing_summary, generate_invoice, list_invoices
from app.models.models import User

router = APIRouter(prefix="/billing", tags=["Billing"])


@router.get("/summary")
async def summary(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_billing_summary(user, db)


@router.get("/invoices")
async def invoices(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    inv_list = await list_invoices(user, db)
    return [
        {
            "id": inv.id,
            "period_start": inv.period_start,
            "period_end": inv.period_end,
            "total_requests": inv.total_requests,
            "amount_cents": inv.amount_cents,
            "amount_dollars": inv.amount_cents / 100,
            "status": inv.status,
            "created_at": inv.created_at,
        }
        for inv in inv_list
    ]


@router.post("/invoices/generate", status_code=201)
async def create_invoice(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    inv = await generate_invoice(user, db)
    return {
        "id": inv.id,
        "period_start": inv.period_start,
        "period_end": inv.period_end,
        "total_requests": inv.total_requests,
        "amount_cents": inv.amount_cents,
        "amount_dollars": inv.amount_cents / 100,
        "status": inv.status,
        "created_at": inv.created_at,
    }
