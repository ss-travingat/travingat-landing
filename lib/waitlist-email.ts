import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export function buildWelcomeEmail(email: string) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Travingat</title>
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
            <td style="padding:32px 40px 24px;text-align:center;">
              <h1 style="margin:0 0 12px;font-size:28px;font-weight:600;color:#fff;line-height:1.3;letter-spacing:-0.5px;">
                You're on the list!
              </h1>
              <p style="margin:0;font-size:16px;line-height:1.6;color:#989898;">
                Thanks for joining the Travingat waitlist. We're building a beautiful way to organize your travel memories — and you'll be first to try it.
              </p>
            </td>
          </tr>

          <!-- Feature cards -->
          <tr>
            <td style="padding:8px 40px 32px;">
              <table role="presentation" width="100%" style="border-spacing:0;">
                <tr>
                  <td style="background:#1a1a1a;border-radius:16px;padding:20px;text-align:center;border:1px solid #252525;">
                    <div style="font-size:28px;margin-bottom:8px;">🌍</div>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Travel Profile</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#7c7c7c;">Countries, media & collections</p>
                  </td>
                  <td width="12"></td>
                  <td style="background:#1a1a1a;border-radius:16px;padding:20px;text-align:center;border:1px solid #252525;">
                    <div style="font-size:28px;margin-bottom:8px;">📸</div>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Photo Archive</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#7c7c7c;">Organize by destination</p>
                  </td>
                  <td width="12"></td>
                  <td style="background:#1a1a1a;border-radius:16px;padding:20px;text-align:center;border:1px solid #252525;">
                    <div style="font-size:28px;margin-bottom:8px;">🗺️</div>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#fff;">Share Journeys</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#7c7c7c;">Connect with travelers</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="https://travingat.com" style="display:inline-block;background:#fff;color:#000;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:999px;letter-spacing:-0.2px;">
                Visit Travingat
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
              <p style="margin:0;font-size:12px;color:#7c7c7c;line-height:1.5;">
                You're receiving this because <span style="color:#989898;">${email}</span> joined the Travingat waitlist.<br />
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

export async function sendWelcomeEmail(email: string) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("SMTP credentials not configured — skipping welcome email");
    return;
  }

  const html = buildWelcomeEmail(email);

  await getTransporter().sendMail({
    from: `"Team Travingat" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Welcome to the Travingat waitlist! 🌍",
    html,
  });
}
