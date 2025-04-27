from fastapi import FastAPI
from routers import auth, user, leave, notify

app = FastAPI(
    title="Leave and Attendance System",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# 把所有 router 掛載進來
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(leave.router)
app.include_router(notify.router)
