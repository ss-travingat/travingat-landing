import nodemailer from 'nodemailer';
import { buildOtpEmail } from '@/emails/otp-template';

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export const sendOtpEmail = async (email: string, otp: string) => {
  // If no real SMTP config is provided, we can just log it for development
  if (!process.env.SMTP_EMAIL) {
    console.log(`\n========================================================`);
    console.log(`Development Mode OTP for ${email}: ${otp}`);
    console.log(`========================================================\n`);
    return;
  }

  const htmlContent = buildOtpEmail(otp);

  try {
    await getTransporter().sendMail({
      from: `"Travingat" <${process.env.SMTP_EMAIL}>`,
      replyTo: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Your Travingat Verification Code',
      html: htmlContent,
    });
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send OTP to ${email}:`, error);
    throw new Error('Failed to send email');
  }
};
