import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from pydantic import BaseModel, Field
import requests

app = FastAPI(
    title="Nine Star Technologies - Lead Automation API",
    version="1.0.0",
    docs_url=None,
    redoc_url=None
)

# Enable CORS for browser requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Pydantic Request Model (Using str to avoid external email_validator dependency)
# -----------------------------------------------------------------------------
class ContactLeadRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., min_length=5, max_length=150)
    phone: Optional[str] = Field(None, max_length=40)
    service_type: Optional[str] = Field(None, max_length=100)
    message: str = Field(..., min_length=5, max_length=3000)

import html

# -----------------------------------------------------------------------------
# Background Task: Telegram Bot Alert (HTML Mode with Full Character Escaping)
# -----------------------------------------------------------------------------
def send_telegram_alert(lead: ContactLeadRequest):
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")

    if not bot_token or not chat_id:
        print("[Telegram] Bot token or Chat ID not configured. Skipping alert.")
        return

    # Safely escape all fields using html.escape to eliminate 400 Bad Request entity parsing errors
    safe_name = html.escape(str(lead.name).strip())
    safe_email = html.escape(str(lead.email).strip())
    safe_phone = html.escape(str(lead.phone or "Not provided").strip())
    safe_service = html.escape(str(lead.service_type or "General Inquiry").strip())
    safe_message = html.escape(str(lead.message).strip())

    telegram_text = (
        "🚨 <b>New Client Lead - Nine Star Technologies</b>\n\n"
        f"👤 <b>Name:</b> {safe_name}\n"
        f"📧 <b>Email:</b> <code>{safe_email}</code>\n"
        f"📞 <b>Phone:</b> {safe_phone}\n"
        f"💼 <b>Service:</b> {safe_service}\n\n"
        f"📝 <b>Message:</b>\n{safe_message}\n\n"
        "⚡ <i>Generated via Official Portal API</i>"
    )

    telegram_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": telegram_text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True
    }

    try:
        res = requests.post(telegram_url, json=payload, timeout=8)
        if res.status_code != 200:
            print(f"[Telegram] Failed to send message: {res.status_code} - {res.text}")
        else:
            print("[Telegram] Alert delivered successfully.")
    except Exception as e:
        print(f"[Telegram] Error sending alert: {e}")

# -----------------------------------------------------------------------------
# Background Task: SMTP Client Confirmation Email
# -----------------------------------------------------------------------------
def send_client_confirmation(lead: ContactLeadRequest):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_EMAIL")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    company_name = os.getenv("COMPANY_NAME", "Nine Star Technologies")
    support_email = os.getenv("SUPPORT_EMAIL", smtp_user or "support@ninestartech.com")

    if not smtp_user or not smtp_pass:
        print("[SMTP] Credentials not configured. Skipping confirmation email.")
        return

    recipient_email = lead.email.strip()
    recipient_name = lead.name.strip()

    subject = f"Inquiry Received - {company_name}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #faf8f3; color: #16130d; margin: 0; padding: 24px; }}
        .card {{ max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e4dcc8; border-radius: 18px; padding: 36px 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }}
        .badge {{ display: inline-block; padding: 4px 14px; background: #f2eee3; color: #94701f; border-radius: 999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }}
        h1 {{ font-family: Georgia, serif; font-size: 24px; margin: 18px 0 12px; color: #16130d; }}
        p {{ line-height: 1.68; font-size: 15px; color: #554f42; margin-bottom: 16px; }}
        .box {{ background: #faf8f3; border-left: 3px solid #c9a24b; border-radius: 6px; padding: 14px 18px; margin: 20px 0; font-size: 14px; color: #332f26; }}
        .footer {{ font-size: 13px; color: #8c8474; margin-top: 28px; border-top: 1px solid #e4dcc8; padding-top: 18px; line-height: 1.6; }}
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">{company_name}</span>
        <h1>Thank you for contacting us, {recipient_name}.</h1>
        <p>We have successfully received your project inquiry. Our technical engineering and development team is reviewing your requirements, and we will get back to you within <strong>24–48 hours</strong>.</p>
        
        <div class="box">
          <strong>Summary of your request:</strong><br>
          <em>Service Interested:</em> {lead.service_type or "General Software Development"}<br>
          <em>Message:</em> "{lead.message}"
        </div>

        <p>If you have urgent updates or extra documentation, feel free to reply directly to this email (<a href="mailto:{support_email}" style="color:#94701f;">{support_email}</a>).</p>

        <div class="footer">
          &copy; 2026 {company_name}. All rights reserved.<br>
          Software studio for Android, Web and Cloud.
        </div>
      </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{company_name} <{smtp_user}>"
    msg["To"] = recipient_email
    msg["Reply-To"] = support_email

    # Plain text fallback
    plain_text = (
        f"Hello {recipient_name},\n\n"
        f"Thank you for contacting {company_name}. We have received your inquiry regarding "
        f"'{lead.service_type or 'Software Solutions'}' and our team will get back to you within 24-48 hours.\n\n"
        f"Best regards,\n"
        f"{company_name} Team\n"
        f"{support_email}"
    )

    msg.attach(MIMEText(plain_text, "plain"))
    msg.attach(MIMEText(html_content, "html"))

    try:
        server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, recipient_email, msg.as_string())
        server.quit()
        print(f"[SMTP] Confirmation email sent successfully to {recipient_email}")
    except Exception as e:
        print(f"[SMTP] Error sending confirmation email: {e}")

# -----------------------------------------------------------------------------
# Background Task: Supabase Leads Storage
# -----------------------------------------------------------------------------
def save_lead_to_supabase(lead: ContactLeadRequest):
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        print("[Supabase] Credentials not configured. Skipping database backup.")
        return

    record = {
        "name": lead.name.strip(),
        "email": lead.email.strip(),
        "phone": (lead.phone or "").strip(),
        "service_type": (lead.service_type or "General Inquiry").strip(),
        "message": lead.message.strip(),
        "status": "new"
    }

    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    endpoint = f"{supabase_url.rstrip('/')}/rest/v1/leads"

    try:
        res = requests.post(endpoint, json=record, headers=headers, timeout=8)
        if res.status_code not in (200, 201, 204):
            print(f"[Supabase] Could not save lead: {res.status_code} - {res.text}")
        else:
            print("[Supabase] Lead stored successfully.")
    except Exception as e:
        print(f"[Supabase] Error storing lead: {e}")

# -----------------------------------------------------------------------------
# Contact POST Route
# -----------------------------------------------------------------------------
@app.post("/api/contact", status_code=status.HTTP_200_OK)
async def handle_contact_submission(
    payload: ContactLeadRequest,
    background_tasks: BackgroundTasks
):
    # Queue asynchronous background tasks to ensure lightning-fast response (<150ms)
    background_tasks.add_task(send_telegram_alert, payload)
    background_tasks.add_task(send_client_confirmation, payload)
    background_tasks.add_task(save_lead_to_supabase, payload)

    return {
        "status": "success",
        "message": "Thank you! We've received your request and sent a confirmation to your email."
    }

# -----------------------------------------------------------------------------
# Vercel Serverless Handler
# -----------------------------------------------------------------------------
handler = Mangum(app)
