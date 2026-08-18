import { sendCardAndInviteEmail } from "../src/emails/cardninvite-mailer";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

async function main() {
  const email = "buildwith.vishnu@gmail.com";
  const name = "Vishnu";
  const editUrl = "https://travingat.com/explorercard";

  console.log(`Sending email to ${email}...`);
  await sendCardAndInviteEmail(email, name, editUrl);
  console.log("Done.");
}

main().catch((err) => {
  console.error("Error sending email:", err);
  process.exit(1);
});
