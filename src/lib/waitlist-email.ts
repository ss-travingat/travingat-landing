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

import { buildWaitlistConfirmEmail } from "@/emails/waitlist-confirm-template";
import { buildWelcomeWaitlistEmail } from "@/emails/welcome-waitlist-template";

export function buildConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${BASE_URL}/waitlist/confirm?token=${encodeURIComponent(token)}`;
  return buildWaitlistConfirmEmail(confirmUrl);
}

export async function sendConfirmationEmail(email: string, token: string) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("SMTP credentials not configured — skipping confirmation email");
    return;
  }

  const html = buildConfirmationEmail(email, token);
  const confirmUrl = `${BASE_URL}/waitlist/confirm?token=${encodeURIComponent(token)}`;

  await getTransporter().sendMail({
    from: `"Team Travingat" <${process.env.SMTP_EMAIL}>`,
    replyTo: process.env.SMTP_EMAIL,
    to: email,
    subject: "Confirm your spot on Travingat",
    text: `Hey! You're one step away from joining Travingat. Click the following link to confirm your spot: ${confirmUrl}`,
    html,
  });
}

export async function sendWelcomeWaitlistEmail(email: string) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn("SMTP credentials not configured — skipping welcome email");
    return;
  }

  const explorerCardUrl = `${BASE_URL}/explorercard`;
  const html = buildWelcomeWaitlistEmail(explorerCardUrl);

  await getTransporter().sendMail({
    from: `"Team Travingat" <${process.env.SMTP_EMAIL}>`,
    replyTo: process.env.SMTP_EMAIL,
    to: email,
    subject: "Welcome to Travingat",
    text: `You're officially on the waitlist. While you wait, create your free Explorer Card and showcase the countries you've explored: ${explorerCardUrl}`,
    html,
  });
}
