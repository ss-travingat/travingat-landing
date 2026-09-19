export function buildWaitlistConfirmEmail(confirmUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
      </style>
      <style>
        .wc-body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #ffffff;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .wc-wrapper {
          width: 100%;
          background-color: #ffffff;
        }
        .wc-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 60px 12px 0 12px;
        }
        .wc-logo-container {
          text-align: left;
          margin-bottom: 40px;
        }
        .wc-hero-img {
          width: 100%;
          max-width: 600px;
          border-radius: 20px;
          margin-bottom: 40px;
          display: block;
        }
        .wc-text-content {
          text-align: center;
          margin-bottom: 24px;
        }
        .wc-title {
          font-size: 32px;
          font-weight: 600;
          color: #161616;
          margin: 0 0 24px 0;
          letter-spacing: -0.5px;
          line-height: 40px;
          font-family: 'Inter Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        .wc-text {
          font-size: 16px;
          line-height: 1.5;
          color: #161616;
          margin: 0;
          font-weight: 400;
          letter-spacing: -0.096px;
        }
        .wc-btn-primary {
          display: block;
          background-color: #5A45F9;
          color: #ffffff !important;
          padding: 12px 20px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
          line-height: 1.5;
          box-sizing: border-box;
          text-align: center;
          width: 100%;
          margin-bottom: 40px;
          letter-spacing: -0.096px;
        }
        .wc-separator {
          width: 100%;
          height: 1px;
          background-color: #EFEFEF;
          margin: 0 0 24px 0;
        }
        .wc-footer {
          text-align: center;
          padding: 0 0 40px 0;
          background-color: #ffffff;
        }
        .wc-footer-logo-block {
          margin-bottom: 24px;
        }
        .wc-footer-logo-block svg {
          height: 28px;
          display: inline-block;
          margin-bottom: 8px;
        }
        .wc-brand-text {
          font-size: 28px;
          font-family: 'Righteous', cursive, sans-serif;
          color: #161616;
          margin: 0 0 8px 0;
          letter-spacing: -0.41px;
        }
        .wc-footer-tagline {
          font-size: 16px;
          color: #161616;
          margin: 0;
          line-height: 1.5;
        }
        .wc-footer-links {
          font-size: 14px;
          color: #656565;
          margin: 0 0 24px 0;
          line-height: 1.4;
        }
        .wc-footer-links a {
          color: #656565;
          text-decoration: none;
        }
        .wc-dot {
          display: inline-block;
          width: 3px;
          height: 3px;
          background-color: #BDBDBD;
          border-radius: 50%;
          vertical-align: middle;
          margin: 0 8px;
        }
        .wc-footer-copyright {
          font-size: 14px;
          color: #656565;
          margin: 0;
          line-height: 1.4;
        }
        @media only screen and (max-width: 600px) {
          .wc-container {
            padding: 40px 24px 0 24px;
          }
          .wc-title {
            font-size: 28px;
          }
        }
      </style>
    </head>
    <body class="wc-body">
      <div class="wc-wrapper">
        <div class="wc-container">
          <div class="wc-logo-container">
            <img src="https://cdn.travingat.com/landingpage-assets/emails/travingat-logo-black.png" alt="Travingat" width="131" height="25" style="display: block; border: 0; outline: none; text-decoration: none;" />
          </div>
          
          <img src="https://cdn.travingat.com/landingpage-assets/emails/waitlist-confirm-hero.jpg" class="wc-hero-img" alt="Confirm your spot">
          
          <div class="wc-text-content">
            <h1 class="wc-title">Confirm your spot</h1>
            <p class="wc-text">
              Please confirm your email address to reserve your spot and be among the first to know when Travingat launches.
            </p>
          </div>
          
          <a href="${confirmUrl}" class="wc-btn-primary">Confirm my spot</a>
        </div>
        
        <div class="wc-separator"></div>

        <div class="wc-footer">
          <div class="wc-footer-logo-block">
            <img src="https://cdn.travingat.com/landingpage-assets/emails/travingat-stacked-black.png" alt="Travingat" width="96" height="55" style="display: block; border: 0; outline: none; text-decoration: none; margin: 0 auto 12px auto;" />
            <p class="wc-footer-tagline">A home for your travel life</p>
          </div>
          
          <div class="wc-footer-links">
            <a href="https://travingat.com/privacy">Privacy policy</a>
            <span class="wc-dot"></span>
            <a href="https://travingat.com/terms">Terms of use</a>
            <span class="wc-dot"></span>
            <a href="mailto:hello@travingat.com">hello@travingat.com</a>
          </div>
          
          <p class="wc-footer-copyright">
            © ${new Date().getFullYear()} Travingat. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
