# routers/notify.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from repositories.db_connection import get_db_connection
from repositories.employee_repository import get_employee_by_id
import uuid, os, smtplib
from email.message import EmailMessage

router = APIRouter(prefix="/api/notifications", tags=["Notify"])

class NotificationRequest(BaseModel):
    employeeId: str
    type: str
    message: str

@router.post("/send", status_code=201)
def send_notify(req: NotificationRequest):
    """
    1. 以 SMTP 發信給指定員工  
    """
    
    # --- (1) 查員工 email ---
    user = get_employee_by_id(req.employeeId)
    if not user or not user.get("email"):
        raise HTTPException(status_code=400, detail="Employee email not found")

    # --- (2) 發送 Email ---
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port   = int(os.getenv("SMTP_PORT", 587))
    smtp_user   = str(os.getenv("SMTP_USER"))
    smtp_pass   = str(os.getenv("SMTP_PASSWORD"))
    print(smtp_user, smtp_pass)
    try:
        msg = EmailMessage()
        msg["Subject"] = f"Notification: {req.type}"
        msg["From"]    = smtp_user
        msg["To"]      = user["email"]
        msg.set_content(req.message)

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
    except Exception as e:
        # 若 email 發送失敗，僅記錄，不影響 API 回應
        print(f"Failed to send email: {e}")

    return {"detail": "Notification stored and email sent (or queued)"}
