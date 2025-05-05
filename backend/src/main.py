from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, user, leave, notify

app = FastAPI(
    title="Leave and Attendance System",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173"],  # 對應前端的 PORT
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 把所有 router 掛載進來
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(leave.router)
app.include_router(notify.router)
