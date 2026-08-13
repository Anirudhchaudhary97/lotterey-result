import nodemailer from "nodemailer";

/**
 * Sends a password reset email using Nodemailer.
 * Configured via SMTP credentials in environment variables.
 */
export async function sendPasswordResetEmail(toEmail: string, resetLink: string): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"PrizeTrack" <onboarding@resend.dev>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF9F5; color: #16181F; padding: 24px; margin: 0; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; padding: 36px; border-radius: 12px; border: 1px solid #C9C4B3; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .logo { font-size: 22px; font-weight: bold; color: #16181F; text-decoration: none; margin-bottom: 24px; display: inline-flex; align-items: center; gap: 8px; }
          .dot { width: 10px; height: 10px; border-radius: 50%; background-color: #A8241E; display: inline-block; }
          h1 { font-size: 20px; color: #16181F; margin-top: 0; margin-bottom: 16px; font-weight: 700; }
          p { font-size: 14px; line-height: 1.6; color: #565B66; margin-bottom: 16px; }
          .button-container { text-align: center; margin: 28px 0; }
          .button { display: inline-block; padding: 12px 28px; background-color: #16181F; color: #FAF9F5 !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; transition: background-color 0.2s; }
          .link-text { word-break: break-all; font-size: 12px; color: #A8241E; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E2DED2; font-size: 12px; color: #8C919E; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo"><span class="dot"></span> PrizeTrack</div>
          <h1>Reset Your Password</h1>
          <p>We received a request to reset the password for your PrizeTrack account associated with <strong>${toEmail}</strong>.</p>
          <p>Click the button below to set a new password. This link is valid for 1 hour.</p>
          <div class="button-container">
            <a href="${resetLink}" class="button" target="_blank">Reset Password →</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p class="link-text"><a href="${resetLink}">${resetLink}</a></p>
          <p style="margin-top: 24px; font-size: 13px; color: #8C919E;">If you didn't request a password reset, you can safely ignore this email.</p>
          <div class="footer">
            PrizeTrack — Inland Revenue Department Nepal Bill Tracker
          </div>
        </div>
      </body>
    </html>
  `;

  if (smtpHost && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for 587/25
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: toEmail,
      subject: "Reset your PrizeTrack password",
      html: htmlContent,
    });
    console.log(`[Email Service] Password reset email sent successfully to ${toEmail}`);
  } else {
    console.warn("⚠️ SMTP credentials not fully configured in .env. Logging email reset link:");
    console.log(`[Email Service fallback] To: ${toEmail}`);
    console.log(`[Email Service fallback] Reset Link: ${resetLink}`);
  }
}
