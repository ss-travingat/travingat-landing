import nodemailer from "nodemailer";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "https://travingat.com";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

// ---------------------------------------------------------------------------
// Confirmation email (magic-link flow)
// ---------------------------------------------------------------------------

export function buildConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${BASE_URL}/api/waitlist/confirm?token=${encodeURIComponent(token)}`;


  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirm your spot on Travingat</title>
</head>
<body style="margin:0;padding:0;background:#000;font-family:'Inter','Segoe UI',sans-serif;">
  <table role="presentation" width="100%" style="background:#000;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" style="max-width:560px;width:100%;background:#111;border-radius:24px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 24px;text-align:center;">
              <span style="font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.5px;">travingat</span>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="border-top:1px solid #252525;"></div>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="padding:40px 40px 32px;text-align:center;">
              <h1 style="margin:0 0 16px;font-size:28px;font-weight:600;color:#fff;line-height:1.3;letter-spacing:-0.5px;">
                Confirm your spot
              </h1>
              <p style="margin:0;font-size:16px;line-height:1.7;color:#989898;">
                Hey,<br /><br />
                You're one step away from joining Travingat — a place to create and share your travel profile.<br /><br />
                Click below to confirm your spot on the waitlist.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center;">
              <a
                href="${confirmUrl}"
                style="display:inline-block;background:#fff;color:#000;font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:999px;letter-spacing:-0.2px;"
              >
                Join waitlist
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="border-top:1px solid #252525;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#7c7c7c;line-height:1.6;">
                You're receiving this because <span style="color:#989898;">${email}</span> signed up for the Travingat waitlist.<br />
                If you didn't sign up, you can safely ignore this email.<br /><br />
                © ${new Date().getFullYear()} Travingat. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return html;
}

export async function sendConfirmationEmail(email: string, token: string) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("SMTP credentials not configured — skipping confirmation email");
    return;
  }

  const html = buildConfirmationEmail(email, token);

  await getTransporter().sendMail({
    from: `"Team Travingat" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Confirm your spot on Travingat",
    html,
  });
}
