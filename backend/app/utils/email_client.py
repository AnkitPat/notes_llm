from starlette.config import Config
import smtplib
from email.mime.text import MIMEText
import os

config = Config(".env")

# For now, just a print statement to simulate email sending
async def send_approval_notification_email(admin_email: str, new_user_email: str, approval_link: str):
    print(f"--- Simulating Email Send ---")
    print(f"To: {admin_email}")
    print(f"Subject: New User Approval Required for {new_user_email}")
    print(f"Body: A new user ({new_user_email}) has logged in. Please approve their access: {approval_link}")
    print(f"--- End Simulating Email Send ---")
