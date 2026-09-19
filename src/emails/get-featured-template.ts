export function buildGetFeaturedEmail(confirmUrl: string): string {
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
          margin-bottom: 40px;
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
        .footer {
          padding-top: 40px;
          text-align: center;
        }
        .footer-logo img {
          height: 20px;
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
        
        <img src="https://cdn.travingat.com/landingpage-assets/emails/welcome-waitlist-hero.png" class="hero-img" alt="Travel Cover">
        
        <h1 class="title">Confirm your application<br/>to get featured</h1>
        <p class="text">
          Please confirm your email address so our team can curate your application to be eligible to be a featured profile
        </p>
        
        <div style="text-align: center;">
          <a href="${confirmUrl}" class="btn-primary" style="color: #ffffff;">Confirm my application</a>
        </div>

        <h2 class="title">What you get</h2>

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
