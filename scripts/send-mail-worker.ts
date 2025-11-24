
import { createClient } from "./../src/lib/server";
import { Resend } from "resend";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}
if (!RESEND_API_KEY) {
  console.error("Missing RESEND_API_KEY");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

async function processPending() {
  const supabase = await createClient();
  try {
    const { data: jobs, error: selectError } = await supabase
      .from("mail_queue")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10);

    if (selectError) {
      console.error("Error selecting mail_queue:", selectError);
      return;
    }

    if (!jobs || jobs.length === 0) {
      // nothing to do
      return;
    }

    for (const job of jobs) {
      console.log(
        `Processing job ${job.id} -> ${job.recipient} (type=${job.type})`,
      );

      // mark processing
      await supabase
        .from("mail_queue")
        .update({
          status: "processing",
          attempts: (job.attempts || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      try {
        const to = job.recipient;
        const subject =
          job.subject ||
          (job.type === "approved"
            ? "Votre compte a été approuvé"
            : "Notification");
        const html =
          job.html ||
          (job.type === "approved"
            ? "<p>Votre compte a été approuvé.</p>"
            : "<p>Notification</p>");

        const resp = await resend.emails.send({
          from: "no-reply@rahmoundif.dev",
          to,
          subject,
          html,
        });

        console.log("Resend response for job", job.id, resp);

        await supabase
          .from("mail_queue")
          .update({
            status: "sent",
            updated_at: new Date().toISOString(),
            resend_response: resp,
          })
          .eq("id", job.id);
      } catch (err) {
        console.error("Error sending job", job.id, err);
        const lastError =
          err instanceof Error ? err.message : typeof err === "string" ? err : String(err);
        await supabase
          .from("mail_queue")
          .update({
            status: "failed",
            last_error: lastError,
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }
    }
  } catch (err) {
    console.error("Worker error:", err);
  }
}

// Run immediately and then every 10 seconds
(async () => {
  console.log("Mail worker started");
  await processPending();
  setInterval(processPending, 10_000);
})();
