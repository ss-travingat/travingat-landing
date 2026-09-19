export function buildFoundingExplorerInviteEmail(name: string, uploadUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #ffffff;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .email-wrapper {
          width: 100%;
          background-color: #ffffff;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 40px 32px;
          box-sizing: border-box;
        }
        .logo {
          text-align: left;
          margin-bottom: 40px;
        }
        .logo img {
          width: 131px;
          height: 25px;
        }
        .hero-img {
          width: 100%;
          height: auto;
          border-radius: 20px;
          margin-bottom: 40px;
          display: block;
        }
        .content-container {
          text-align: center;
          margin-bottom: 40px;
        }
        .title {
          color: #161616;
          text-align: center;
          font-family: 'Inter Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-size: 32px;
          font-style: normal;
          font-weight: 600;
          line-height: 40px;
          letter-spacing: -0.5px;
          margin: 0 0 24px 0;
        }
        .text {
          color: #161616;
          text-align: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 24px;
          letter-spacing: -0.096px;
          margin: 0 0 24px 0;
        }
        .requirements-box {
          background-color: #ffffff;
          border: 1px solid #efefef;
          border-radius: 20px;
          padding: 24px;
          margin: 0;
          text-align: left;
        }
        .req-title {
          font-size: 16px;
          color: #161616;
          margin: 0 0 16px 0;
          font-weight: 400;
          line-height: 24px;
        }
        .req-list {
          margin: 0;
          padding-left: 24px;
          font-size: 16px;
          color: #161616;
          line-height: 24px;
          list-style-type: disc !important;
        }
        .req-list li {
          display: list-item !important;
          margin-bottom: 4px;
        }
        .req-list li:last-child {
          margin-bottom: 0;
        }
        .btn-primary {
          display: inline-block;
          background-color: #5A45F9;
          color: #ffffff !important;
          padding: 12px 20px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
          margin-bottom: 80px;
          letter-spacing: -0.096px;
          white-space: nowrap;
        }
        .footer {
          text-align: center;
          padding: 0;
          background-color: #ffffff;
        }
        .footer-logo img {
          height: auto;
          margin-bottom: 8px;
        }
        .footer-text {
          font-size: 16px;
          color: #161616;
          margin: 0 0 24px 0;
          font-weight: 400;
          line-height: 24px;
        }
        .footer-links {
          font-size: 14px;
          color: #656565;
          margin: 0 0 24px 0;
          line-height: 20px;
        }
        .footer-links a {
          color: #656565;
          text-decoration: none;
        }
        .footer-copyright {
          font-size: 14px;
          color: #656565;
          margin: 0;
          line-height: 20px;
        }
        
        @media only screen and (max-width: 599px) {
          .email-container {
            padding: 60px 12px;
          }
          .logo {
            margin-bottom: 24px;
          }
          .logo img {
            width: 100px !important;
            height: 19px !important;
          }
          .hero-img {
            border-radius: 16px;
            margin-bottom: 24px;
          }
          .content-container {
            margin-bottom: 24px;
            padding: 0 8px;
          }
          .title {
            font-size: 24px;
            line-height: 32px;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
          }
          .text {
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            letter-spacing: -0.084px;
            margin-bottom: 16px;
          }
          .requirements-box {
            border-radius: 16px;
            padding: 20px;
          }
          .req-title {
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 12px;
          }
          .req-list {
            font-size: 14px;
            line-height: 20px;
            padding-left: 21px;
          }
          .btn-primary {
            padding: 10px 18px;
            font-size: 16px;
            margin-bottom: 48px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <div class="logo">
            <img src="https://cdn.travingat.com/landingpage-assets/emails/travingat-logo-black.png" alt="Travingat" width="131" height="25" style="display: block; border: 0; outline: none; text-decoration: none;" />
          </div>
          
          <img src="https://cdn.travingat.com/landingpage-assets/emails/founding-explorer-hero.png" class="hero-img" alt="Founding Explorer">
          
          <div class="content-container">
            <h1 class="title">You're invited to become a<br/>Founding explorer</h1>
            <p class="text">
              Hey ${name}, to receive your Founding Explorer badge, complete your featured travel profile by uploading your travel photos and videos.
            </p>
            
            <div class="requirements-box">
              <p class="req-title">To qualify as a Founding Explorer, your profile should include:</p>
              <ul class="req-list">
                <li>At least <strong>10 countries</strong> visited</li>
                <li>At least <strong>4 collections</strong> created</li>
                <li>At least <strong>20 photos + videos</strong> per country and per collection</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${uploadUrl}" class="btn-primary">Upload your travel photos & videos</a>
          </div>
          
          <div class="footer">
            <div style="margin-bottom: 8px;">
              <img src="https://cdn.travingat.com/landingpage-assets/emails/travingat-stacked-black.png" alt="Travingat" width="96" height="55" style="display: block; border: 0; outline: none; text-decoration: none; margin: 0 auto;" />
            </div>
            <p class="footer-text">A home for your travel life</p>
            <p class="footer-links">
              <a href="https://travingat.com/privacy">Privacy policy</a>
              <span style="display: inline-block; width: 3px; height: 3px; background-color: #BDBDBD; border-radius: 50%; vertical-align: middle; margin: 0 8px;"></span>
              <a href="https://travingat.com/terms">Terms of use</a>
              <span style="display: inline-block; width: 3px; height: 3px; background-color: #BDBDBD; border-radius: 50%; vertical-align: middle; margin: 0 8px;"></span>
              <a href="mailto:hello@travingat.com">hello@travingat.com</a>
            </p>
            <p class="footer-copyright">
              © ${new Date().getFullYear()} Travingat. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
