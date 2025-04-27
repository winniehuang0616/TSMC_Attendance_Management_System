# services/notification_service.py
import os, smtplib
from email.message import EmailMessage
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv() 

class NotificationService:
    @staticmethod
    def send_email(to: str, subject: str, body: str) -> None:
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port   = int(os.getenv("SMTP_PORT", 587))
        smtp_user   = os.getenv("SMTP_USER")
        smtp_pass   = os.getenv("SMTP_PASSWORD")
        if not smtp_user or not smtp_pass:
            raise HTTPException(status_code=500, detail="SMTP credentials not configured")

        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"]    = smtp_user
        msg["To"]      = to
        msg.set_content(body)

        try:
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.send_message(msg)
        except Exception as e:
            # 失敗時僅記錄，不抛出讓上層停掉
            print(f"[WARN] Failed to send email to {to}: {e}")
