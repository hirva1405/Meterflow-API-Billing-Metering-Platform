from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import create_tables
from app.api import auth, apis, keys, usage, billing


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    print(f"🌸 MeterFlow {settings.VERSION} started!")
    yield
    print("👋 MeterFlow shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(apis.router, prefix="/api")
app.include_router(keys.router, prefix="/api")
app.include_router(usage.router, prefix="/api")
app.include_router(billing.router, prefix="/api")


@app.get("/")
async def root():
    return {"service": "MeterFlow", "version": settings.VERSION, "status": "🌸 blooming"}


@app.get("/health")
async def health():
    return {"status": "ok"}
