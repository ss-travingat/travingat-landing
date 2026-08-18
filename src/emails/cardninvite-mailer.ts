import nodemailer from 'nodemailer';
import { buildCardAndInviteEmail } from './cardninvite-template';

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export const sendCardAndInviteEmail = async (email: string, name: string, editUrl: string) => {
  if (!process.env.SMTP_EMAIL) {
    console.log(`\n========================================================`);
    console.log(`Development Mode: Card & Invite email for ${email}`);
    console.log(`Edit URL: ${editUrl}`);
    console.log(`========================================================\n`);
    return;
  }

  const htmlContent = buildCardAndInviteEmail(name, editUrl);

  const transporter = getTransporter();

  try {
    await transporter.sendMail({
      from: `"Travingat" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Your Explorer Card is ready + Get Featured 🚀',
      html: htmlContent,
    });
    console.log(`Card & Invite email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send Card & Invite email to ${email}:`, error);
  }
};
