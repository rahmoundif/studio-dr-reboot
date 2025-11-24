import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";


export async function POST(req: Request) {
const supabase = await createClient();
  const { id, action } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (action === "approve") {
    const { error } = await supabase
      .from("profiles")
      .update({ is_approved: true })
      .eq("id", id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", id)
      .single();

      if (profileError) {
  return NextResponse.json(
    { error: profileError.message },
    { status: 500 },
  );
}

if (!profile || !profile.email) {
  return NextResponse.json(
    { error: "Aucun email trouvé pour ce profil" },
    { status: 404 },
  );
}
    await sendEmail({
      to: profile.email,
      subject: "compte approuvé",
      html: "<p>Votre compte a été approuvé</p>",
    });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "invalid action" }, { status: 400 });
}
