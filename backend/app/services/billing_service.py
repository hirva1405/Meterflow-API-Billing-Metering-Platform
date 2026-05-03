from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.models import Invoice, InvoiceStatus, UsageLog, User, PlanTier

FREE_LIMIT = 1000
PRO_PRICE = 0.50
ENTERPRISE_PRICE = 0.20


async def calculate_monthly_bill(user: User, db: AsyncSession) -> dict:
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    month_requests = (await db.execute(
        select(func.count(UsageLog.id)).where(UsageLog.user_id == user.id, UsageLog.timestamp >= month_start)
    )).scalar() or 0

    if user.plan == PlanTier.FREE:
        billable = max(0, month_requests - FREE_LIMIT)
        price = PRO_PRICE
    elif user.plan == PlanTier.PRO:
        billable = month_requests
        price = PRO_PRICE
    else:
        billable = month_requests
        price = ENTERPRISE_PRICE

    amount_dollars = (billable / 1000) * price
    amount_cents = int(amount_dollars * 100)

    return {
        "current_plan": user.plan,
        "this_month_requests": month_requests,
        "this_month_cost_cents": amount_cents,
        "this_month_cost_dollars": round(amount_dollars, 2),
        "free_tier_remaining": max(0, FREE_LIMIT - month_requests) if user.plan == PlanTier.FREE else 0,
    }


async def generate_invoice(user: User, db: AsyncSession) -> Invoice:
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    bill = await calculate_monthly_bill(user, db)
    invoice = Invoice(
        user_id=user.id,
        period_start=month_start,
        period_end=now,
        total_requests=bill["this_month_requests"],
        amount_cents=bill["this_month_cost_cents"],
        status=InvoiceStatus.PENDING,
    )
    db.add(invoice)
    await db.flush()
    return invoice


async def list_invoices(user: User, db: AsyncSession) -> list:
    result = await db.execute(
        select(Invoice).where(Invoice.user_id == user.id).order_by(Invoice.created_at.desc()).limit(12)
    )
    return result.scalars().all()


async def get_billing_summary(user: User, db: AsyncSession) -> dict:
    bill = await calculate_monthly_bill(user, db)
    invoices = await list_invoices(user, db)
    bill["invoices"] = [
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
        for inv in invoices
    ]
    return bill
