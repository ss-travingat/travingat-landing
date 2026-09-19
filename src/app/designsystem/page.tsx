"use client";

import { useState } from "react";

import TypographyShowcase from "@/components/designsystem/TypographyShowcase";
import ColorPaletteShowcase from "@/components/designsystem/ColorPaletteShowcase";
import ButtonShowcase from "@/components/designsystem/ButtonShowcase";
import TabsShowcase from "@/components/designsystem/TabsShowcase";
import TooltipShowcase from "@/components/designsystem/TooltipShowcase";

import BadgeShowcase from "@/components/designsystem/BadgeShowcase";
import FoundingExplorer from "@/components/ui/FoundingExplorerBadge";
import MoreOptionsButtonShowcase from "@/components/designsystem/MoreOptionsButtonShowcase";
import { buildOtpEmail } from "@/emails/otp-template";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";
import { WaitlistPopup } from "@/components/ui/WaitlistPopup";
import { WaitlistBar } from "@/components/ui/waitlistbar";
import { Badge } from "@/components/ui/Badge";
import { buildCardAndInviteEmail } from "@/emails/cardninvite-template";
import { buildWaitlistConfirmEmail } from "@/emails/waitlist-confirm-template";
import { buildWelcomeWaitlistEmail } from "@/emails/welcome-waitlist-template";
import { buildGetFeaturedEmail } from "@/emails/get-featured-template";
import { buildFoundingExplorerInviteEmail } from "@/emails/founding-explorer-invite-template";


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

const MonitorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
);

const SmartphoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);

function EmailPreviewBox({ title, htmlContent }: { title: string, htmlContent: string }) {
  const [showCode, setShowCode] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="ds-font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c] m-0">
          {title}
        </p>
        <div className="flex items-center gap-2">
          {!showCode && (
            <div className="flex items-center gap-1 mr-2 bg-[#1c212c] p-1 rounded-md">
              <button 
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'desktop' ? 'bg-[#2a3140] text-white shadow-sm' : 'text-[#7e889c] hover:text-white'}`}
                title="Desktop View (600px)"
              >
                <MonitorIcon />
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'mobile' ? 'bg-[#2a3140] text-white shadow-sm' : 'text-[#7e889c] hover:text-white'}`}
                title="Mobile View (360px)"
              >
                <SmartphoneIcon />
              </button>
            </div>
          )}
          <button 
            onClick={() => setShowCode(!showCode)}
            className="text-[#7e889c] hover:text-white transition-colors flex items-center justify-center p-1.5 bg-[#1c212c] rounded-md shadow-sm"
            title={showCode ? "Show Preview" : "Show HTML code"}
          >
            {showCode ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>
      
      {showCode ? (
        <div className="p-4 bg-[#0f1116] rounded-xl border border-[#252525] overflow-auto max-h-[800px]">
          <pre className="text-xs text-[#a1a1aa] whitespace-pre-wrap font-mono">
            <code>{htmlContent}</code>
          </pre>
        </div>
      ) : (
        <div className="flex justify-center bg-white p-4 md:p-8 rounded-xl overflow-hidden border border-[#252525]">
          <iframe
            className={`w-full transition-all duration-300 ease-in-out origin-top border-0 ${viewMode === 'desktop' ? 'max-w-[600px]' : 'max-w-[360px]'}`}
            style={{ height: '800px' }}
            srcDoc={htmlContent}
            title="Email Preview"
          />
        </div>
      )}
    </div>
  );
}

export default function DesignSystemPage() {

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <main className="pb-10">
      <section className="px-3 pb-4 pt-10 md:px-10 md:pt-14 xl:px-24 xl:pt-16">
        <div className="rounded-3xl border border-[#20242d] bg-[radial-gradient(120%_120%_at_10%_10%,#1a1f2b_0%,#0d1017_56%,#06070a_100%)] p-6 md:p-10">
          <p className="ds-font-body mb-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#8b93a3]">Travingat Foundation</p>
          <h1 className="ds-font-display text-[48px] font-semibold leading-[1.08] tracking-[-1px] text-white md:text-[64px]">
            Design System Demo
          </h1>
          <p className="ds-font-body mt-4 max-w-215 text-[18px] leading-7 text-[#b3bccf]">
            This page implements the requested Figma foundations for Typography, Color Palette, Buttons, Tabs, and
            Tooltips with Inter for body copy and Inter Display for headings.
          </p>
          <p className="ds-font-body mt-3 text-[14px] leading-6 text-[#909cb3]">
            Inter Display is loaded directly from <strong>landing/inter-display</strong> to match the Figma typography source.
          </p>
        </div>
      </section>

      <TypographyShowcase />
      <ColorPaletteShowcase withSidebar />
      <ButtonShowcase />
      <MoreOptionsButtonShowcase />
      <TabsShowcase />
      <TooltipShowcase />
      <BadgeShowcase />

      <section className="px-3 py-10 md:px-10 md:py-14 xl:px-24 xl:py-16">
        <div className="ds-shell overflow-hidden bg-[#0f1116] p-5 md:p-8 xl:p-10">
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="ds-font-display text-[42px] font-semibold leading-[1.1] tracking-[-0.5px] text-white">
                Component Gallery
              </h2>
              <p className="ds-font-body mt-2 text-[14px] text-[#798298]">
                Preview every core UI component in one place.
              </p>
            </div>
            <p className="ds-font-body text-[12px] text-[#6f798b]">
              Use the button below to preview the Waitlist popup overlay.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#1c212c] bg-[#0b0d13] p-6">
              <h3 className="ds-font-display mb-4 text-[26px] font-semibold text-white">Text</h3>
              <div className="space-y-3">
                <Text variant="h5" weight="semibold" className="text-white">
                  Display / h5 — Semibold
                </Text>
                <Text variant="text-lg" weight="medium" className="text-white-300">
                  Text lg — Medium
                </Text>
                <Text variant="text-sm" className="text-white-400">
                  Text sm — Regular
                </Text>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1c212c] bg-[#0b0d13] p-6">
              <h3 className="ds-font-display mb-4 text-[26px] font-semibold text-white">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="violet">Violet</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" loading>
                  Loading
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1c212c] bg-[#0b0d13] p-6">
              <h3 className="ds-font-display mb-4 text-[26px] font-semibold text-white">Inputs</h3>
              <div className="space-y-3">
                <Input
                  size="sm"
                  placeholder="Input (sm)"
                  className="border border-white-900 bg-black"
                />
                <Input
                  size="md"
                  placeholder="Input (md)"
                  className="border border-white-900 bg-black"
                />
                <Input
                  size="lg"
                  placeholder="Input (lg)"
                  className="border border-white-900 bg-black"
                />
              </div>
              <div className="mt-6 space-y-3">
                <Textarea
                  size="sm"
                  placeholder="Textarea (sm)"
                  className="border border-white-900 bg-black"
                />
                <Textarea
                  size="md"
                  placeholder="Textarea (md)"
                  className="border border-white-900 bg-black"
                />
                <Textarea
                  size="lg"
                  placeholder="Textarea (lg)"
                  className="border border-white-900 bg-black"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#1c212c] bg-[#0b0d13] p-6">
              <h3 className="ds-font-display mb-4 text-[26px] font-semibold text-white">Badges</h3>
              <div className="flex flex-col gap-6">
                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">UI Badges</p>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="violet">Violet</Badge>
                    <Badge variant="cyan">Cyan</Badge>
                  </div>
                </div>

                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">Animated Badges</p>
                  <div className="w-[152px] h-[152px]">
                    <FoundingExplorer />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1c212c] bg-[#0b0d13] p-6">
              <h3 className="ds-font-display mb-4 text-[26px] font-semibold text-white">Waitlist</h3>
              <div className="space-y-6">
                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">
                    Waitlist Bar
                  </p>
                  <WaitlistBar className="max-w-[520px]" />
                </div>
                <div>
                  <p className="ds-font-body mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#7e889c]">
                    Waitlist Popup
                  </p>
                  <Button variant="secondary" onClick={() => setIsWaitlistOpen(true)}>
                    Open Waitlist Popup
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1c212c] bg-[#0b0d13] p-6 lg:col-span-2">
              <h3 className="ds-font-display mb-4 text-[26px] font-semibold text-white">Email Templates</h3>
              <div className="space-y-8">
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
              </div>
            </div>

          </div>
        </div>
      </section>

      <WaitlistPopup open={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </main>
  );
}
