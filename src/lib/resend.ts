import type { emailType } from '@/types/resend';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.FROM_EMAIL || "";
if (!from) {
      console.error("Il manque l'ENV");
      process.exit(1);
    }

export async function sendEmail({ to, subject, html } : emailType) {
  return resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}