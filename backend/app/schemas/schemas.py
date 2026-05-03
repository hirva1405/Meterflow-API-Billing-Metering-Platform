from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.models import PlanTier, InvoiceStatus


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=1)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    email: str
    full_name: str
    plan: PlanTier
    is_active: bool
    created_at: datetime


class APICreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: Optional[str] = None
    endpoint_url: Optional[str] = None
    rate_limit_per_minute: int = Field(default=60, ge=1)
    rate_limit_per_day: int = Field(default=10000, ge=1)
    price_per_1k_requests: float = Field(default=0.50, ge=0.0)


class APIUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    rate_limit_per_minute: Optional[int] = None
    rate_limit_per_day: Optional[int] = None
    price_per_1k_requests: Optional[float] = None
    is_active: Optional[bool] = None


class APIOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    description: Optional[str] = None
    endpoint_url: Optional[str] = None
    rate_limit_per_minute: int
    rate_limit_per_day: int
    price_per_1k_requests: float
    is_active: bool
    created_at: datetime
    total_keys: Optional[int] = 0
    total_requests_today: Optional[int] = 0


class APIKeyCreate(BaseModel):
    name: str = Field(default="Default Key", max_length=100)
    expires_at: Optional[datetime] = None


class APIKeyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    api_id: str
    name: str
    key: str
    is_active: bool
    total_requests: int
    last_used_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: datetime


class UsageStats(BaseModel):
    total_requests: int
    requests_today: int
    requests_this_hour: int
    requests_this_month: int
    avg_response_time_ms: float
    success_rate: float
    requests_by_day: list[dict] = []


class InvoiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    period_start: datetime
    period_end: datetime
    total_requests: int
    amount_cents: int
    amount_dollars: float = 0.0
    status: InvoiceStatus
    created_at: datetime
