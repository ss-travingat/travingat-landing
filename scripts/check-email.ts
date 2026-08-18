import { buildCardAndInviteEmail } from "../src/emails/cardninvite-template";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const html = buildCardAndInviteEmail("Vishnu", "https://travingat.com/explorercard");
console.log(html);
