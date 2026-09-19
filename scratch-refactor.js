const fs = require('fs');

const file = 'src/app/designsystem/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Insert the new component right before "export default function DesignSystemPage() {"
const componentCode = `
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

function EmailPreviewBox({ title, htmlContent }: { title: string, htmlContent: string }) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <p className="ds-font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c] m-0">
          {title}
        </p>
        <button 
          onClick={() => setShowCode(!showCode)}
          className="text-[#7e889c] hover:text-white transition-colors flex items-center justify-center p-1"
          title="Toggle HTML code"
        >
          {showCode ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      <div className="flex justify-center bg-white p-8 rounded-xl overflow-hidden border border-[#252525]">
        <div
          className="w-full max-w-[600px]"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
      {showCode && (
        <div className="mt-4 p-4 bg-[#0f1116] rounded-xl border border-[#252525] overflow-auto max-h-[400px]">
          <pre className="text-xs text-[#a1a1aa] whitespace-pre-wrap font-mono">
            <code>{htmlContent}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default function DesignSystemPage() {
`;

content = content.replace("export default function DesignSystemPage() {", componentCode);

// Now replace the repetitive blocks with EmailPreviewBox calls
// I'll just use string replacement for the entire space-y-8 div contents.

const oldHtmlBlock = `              <div className="space-y-8">
                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">Card & Invite HTML Email Preview</p>
                  <div className="flex justify-center bg-white p-8 rounded-xl overflow-hidden border border-[#252525]">
                    <div
                      className="w-full max-w-[600px]"
                      dangerouslySetInnerHTML={{ __html: buildCardAndInviteEmail("Jane Doe", "https://www.travingat.com/explorercard") }}
                    />
                  </div>
                </div>

                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">OTP Verification HTML Email Preview</p>
                  <div className="flex justify-center bg-white p-8 rounded-xl overflow-hidden border border-[#252525]">
                    <div
                      className="w-full max-w-[600px]"
                      dangerouslySetInnerHTML={{ __html: buildOtpEmail("1234") }}
                    />
                  </div>
                </div>

                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">Waitlist Confirm HTML Email Preview</p>
                  <div className="flex justify-center bg-white p-8 rounded-xl overflow-hidden border border-[#252525]">
                    <div
                      className="w-full max-w-[600px]"
                      dangerouslySetInnerHTML={{ __html: buildWaitlistConfirmEmail("https://www.travingat.com/waitlist/confirm?token=123") }}
                    />
                  </div>
                </div>

                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">Welcome Waitlist HTML Email Preview</p>
                  <div className="flex justify-center bg-white p-8 rounded-xl overflow-hidden border border-[#252525]">
                    <div
                      className="w-full max-w-[600px]"
                      dangerouslySetInnerHTML={{ __html: buildWelcomeWaitlistEmail("https://www.travingat.com/explorercard") }}
                    />
                  </div>
                </div>

                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">Get Featured HTML Email Preview</p>
                  <div className="flex justify-center bg-white p-8 rounded-xl overflow-hidden border border-[#252525]">
                    <div
                      className="w-full max-w-[600px]"
                      dangerouslySetInnerHTML={{ __html: buildGetFeaturedEmail("https://www.travingat.com/confirm") }}
                    />
                  </div>
                </div>

                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">Founding Explorer Invite HTML Email Preview</p>
                  <div className="flex justify-center bg-white p-8 rounded-xl overflow-hidden border border-[#252525]">
                    <div
                      className="w-full max-w-[600px]"
                      dangerouslySetInnerHTML={{ __html: buildFoundingExplorerInviteEmail("James", "https://www.travingat.com/upload") }}
                    />
                  </div>
                </div>
              </div>`;

const newHtmlBlock = `              <div className="space-y-8">
                <EmailPreviewBox 
                  title="Card & Invite HTML Email Preview"
                  htmlContent={buildCardAndInviteEmail("Jane Doe", "https://www.travingat.com/explorercard")}
                />
                
                <EmailPreviewBox 
                  title="OTP Verification HTML Email Preview"
                  htmlContent={buildOtpEmail("1234")}
                />

                <EmailPreviewBox 
                  title="Waitlist Confirm HTML Email Preview"
                  htmlContent={buildWaitlistConfirmEmail("https://www.travingat.com/waitlist/confirm?token=123")}
                />

                <EmailPreviewBox 
                  title="Welcome Waitlist HTML Email Preview"
                  htmlContent={buildWelcomeWaitlistEmail("https://www.travingat.com/explorercard")}
                />

                <EmailPreviewBox 
                  title="Get Featured HTML Email Preview"
                  htmlContent={buildGetFeaturedEmail("https://www.travingat.com/confirm")}
                />

                <EmailPreviewBox 
                  title="Founding Explorer Invite HTML Email Preview"
                  htmlContent={buildFoundingExplorerInviteEmail("James", "https://www.travingat.com/upload")}
                />
              </div>`;

if (!content.includes(oldHtmlBlock)) {
  console.log("Error: old block not found. Trying regex or manual replace.");
  // Let's fallback to regex
  const regex = /<div className="space-y-8">[\s\S]*?Founding Explorer Invite HTML Email Preview.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
  content = content.replace(regex, newHtmlBlock + "\n            </div>");
} else {
  content = content.replace(oldHtmlBlock, newHtmlBlock);
}

fs.writeFileSync(file, content);
console.log("Done");
