import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";
import { createClient } from "@/lib/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const { id, email } = body as { id?: string; email?: string };

  const supabase = await createClient();

  let targetEmail = email;
  if (!targetEmail && id) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", id)
      .single();
    if (profileError)
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    targetEmail = profile?.email;
  }

  if (!targetEmail)
    return NextResponse.json({ error: "email required" }, { status: 400 });

  try {
    await sendEmail({
      to: targetEmail,
      subject: "Validation de votre compte",
      html: `
        <p>Bonjour,</p>
        <p>Votre compte est en attente d'approbation par un administrateur.</p>
        <p>Si vous pensez qu'il y a un problème, contactez l'administrateur.</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
