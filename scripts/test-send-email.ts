
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

async function main() {
  try {
    const to = process.env.TEST_EMAIL;
    if (!to) {
      console.error("Missing TEST_EMAIL");
      process.exit(1);
    }
    const from = process.env.FROM_EMAIL;
    if (!from) {
      console.error("Missing ADMIN_MAIL");
      process.exit(1);
    }
    const r = await resend.emails.send({
      from,
      to,
      subject: "Test d'envoi Resend",
      html: "<p>Test d'envoi Resend — si tu reçois ça, le client fonctionne.</p>",
    });
    console.log("Resend response:", r);
  } catch (err) {
    console.error("Erreur envoi Resend:", err);
  }
}

main();
