export function buildCardAndInviteEmail(name: string, editUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #F8FAFC;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 40px 32px;
        }
        .logo {
          text-align: left;
          margin-bottom: 24px;
        }
        .logo img {
          height: 24px;
        }
        .hero-img {
          width: 100%;
          border-radius: 16px;
          margin-bottom: 32px;
        }
        .card-img {
          width: 360px;
          max-width: 100%;
          border-radius: 12px;
          display: block;
          margin: 0 auto 24px;
        }
        .title {
          font-size: 24px;
          font-weight: 600;
          color: #111111;
          margin: 0 0 16px 0;
          text-align: center;
          letter-spacing: -0.5px;
        }
        .text {
          font-size: 15px;
          line-height: 1.5;
          color: #4A4A4A;
          margin: 0 0 24px 0;
          text-align: center;
        }
        .btn-light {
          display: block;
          background-color: #EEF2FF;
          color: #5952FF;
          padding: 14px 24px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        }
        .btn-primary {
          display: block;
          background-color: #5952FF;
          color: #ffffff !important;
          padding: 14px 24px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        }

        .feature-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
        }
        .feature-cell-left {
          padding: 0 8px 16px 0;
          width: 50%;
          vertical-align: top;
        }
        .feature-cell-right {
          padding: 0 0 16px 8px;
          width: 50%;
          vertical-align: top;
        }
        .feature-card {
          background-color: #ffffff;
          border: 1px solid #E5E5E5;
          border-radius: 16px;
          padding: 24px;
          text-align: left;
          box-sizing: border-box;
          height: 100%;
        }
        .feature-icon {
          margin-bottom: 24px;
        }
        .feature-icon img {
          height: 64px;
          display: block;
        }
        .feature-text {
          font-size: 15px;
          color: #111111;
          margin: 0;
          line-height: 1.5;
          font-weight: 400;
        }
        .fine-print {
          font-size: 12px;
          color: #6B7280;
          text-align: center;
          margin-top: 24px;
          line-height: 1.5;
        }
        .footer {
          padding-top: 40px;
          text-align: center;
        }
        .footer-logo img {
          height: auto;
          margin-bottom: 16px;
        }
        .footer-text {
          font-size: 14px;
          color: #111111;
          margin: 0 0 16px 0;
          font-weight: 500;
        }
        .footer-links {
          font-size: 13px;
          color: #9CA3AF;
          margin: 0 0 24px 0;
        }
        .footer-links a {
          color: #9CA3AF;
          text-decoration: none;
        }
        .footer-copyright {
          font-size: 13px;
          color: #9CA3AF;
          margin: 0;
        }
        @media only screen and (max-width: 600px) {
          .email-container {
            padding: 32px 16px;
          }
          .feature-cell-left {
            padding: 0 6px 12px 0;
          }
          .feature-cell-right {
            padding: 0 0 12px 6px;
          }
          .feature-card {
            padding: 16px 12px;
            border-radius: 12px;
          }
          .feature-icon {
            margin-bottom: 12px;
          }
          .feature-icon img {
            height: 40px;
          }
          .feature-text {
            font-size: 13px;
          }
          .title {
            font-size: 22px;
          }
          .text {
            font-size: 14px;
          }
          .footer {
            padding-top: 40px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="logo">
          <img src="https://cdn.travingat.com/landingpage-assets/emails/travingat-logo-black.png" alt="Travingat" width="131" height="25" style="display: block; border: 0; outline: none; text-decoration: none;" />
        </div>
        
        <img src="https://cdn.travingat.com/landingpage-assets/emails/hero-cover.png" class="hero-img" alt="Travel Cover">
        
        <h1 class="title">Your Explorer Card is ready</h1>
        <p class="text">
          Hey ${name}, you have successfully created your Explorer Card and officially joined the first travelers building Travingat.
        </p>
        
        <div style="text-align: center;">
          <a href="${editUrl}" class="btn-light"><img src="https://cdn.travingat.com/landingpage-assets/designsystem/figma/imgEdit.png" alt="" style="display:inline-block;height:16px;vertical-align:middle;margin-right:8px;"> Edit your explorer card</a>
        </div>

        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 40px 0;">
          <tr>
            <td width="45%" valign="middle">
              <div style="border-top: 1px solid #E5E7EB;"></div>
            </td>
            <td width="10%" valign="middle" style="text-align: center; padding: 0 16px; color: #9CA3AF; font-size: 14px; white-space: nowrap;">Next step</td>
            <td width="45%" valign="middle">
              <div style="border-top: 1px solid #E5E7EB;"></div>
            </td>
          </tr>
        </table>

        <h2 class="title">Get featured</h2>
        <p class="text">
          Become one of our first Founding Explorers and receive the following:
        </p>

        <table class="feature-table" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td class="feature-cell-left">
              <div class="feature-card">
                <div class="feature-icon"><img src="https://cdn.travingat.com/landingpage-assets/designsystem/figma/imgTraveler.png" alt="Founding explorers"></div>
                <p class="feature-text">Become the first 100 founding members</p>
              </div>
            </td>
            <td class="feature-cell-right">
              <div class="feature-card">
                <div class="feature-icon"><img src="https://cdn.travingat.com/landingpage-assets/designsystem/figma/imgB.png" alt="Founding badge"></div>
                <p class="feature-text">Display a Founding Explorer badge on profile</p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="feature-cell-left">
              <div class="feature-card">
                <div class="feature-icon"><img src="https://cdn.travingat.com/landingpage-assets/designsystem/figma/img3.png" alt="Templates"></div>
                <p class="feature-text">Get 2 free premium templates upon launch</p>
              </div>
            </td>
            <td class="feature-cell-right">
              <div class="feature-card">
                <div class="feature-icon"><img src="https://cdn.travingat.com/landingpage-assets/designsystem/figma/img4.png" alt="Featured profile"></div>
                <p class="feature-text">A professionally created featured travel profile</p>
              </div>
            </td>
          </tr>
        </table>

        <div style="text-align: center;">
          <a href="#" class="btn-primary" style="color: #ffffff;">Apply to get featured</a>
        </div>
        
        <p class="fine-print">
          Applications are reviewed manually. If selected, we'll email you a private upload link to create your travel profile before launch.
        </p>

        <div class="footer">
          <div class="footer-logo">
            <img src="https://cdn.travingat.com/landingpage-assets/emails/travingat-stacked-black.png" alt="Travingat" width="96" height="55" style="display: block; border: 0; outline: none; text-decoration: none; margin: 0 auto 12px auto;" />
          </div>
          <p class="footer-text">A home for your travel life</p>
          <p class="footer-links">
            <a href="https://travingat.com/privacy">Privacy policy</a> • <a href="https://travingat.com/terms">Terms of use</a> • <a href="mailto:hello@travingat.com">hello@travingat.com</a>
          </p>
          <p class="footer-copyright">
            © ${new Date().getFullYear()} Travingat. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
