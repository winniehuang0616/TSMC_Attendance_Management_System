from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, user, leave, notify

app = FastAPI(
    title="Leave and Attendance System",
    description="Backend API for Leave and Attendance Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # Alternative development port
    "http://localhost",
    "*",

]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routers
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(leave.router)
app.include_router(notify.router)


@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/api/ping")
def ping():
    return {"message": "pong"}
