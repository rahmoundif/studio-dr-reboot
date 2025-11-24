// import { redirect } from 'next/navigation';
// import { createClient} from '@/lib/server';

// async function notifyAdmin(
//   email: string,
//   userId: string,
//   fullname?: string | null,
//   role?: string | null,
//   avatarUrl?: string | null,
// ) {
//   if (!process.env.SUPABASE_EDGE_NOTIFY_URL) return;
//   // Build payload with optional fields
//   const payload = {
//     email: (email ?? '').trim(),
//     userId,
//     fullname: fullname ?? null,
//     role: role ?? null,
//     avatarUrl: avatarUrl ?? null,
//   };

//   // Appel à ton Edge Function Supabase (fire-and-forget)
//   // include anon key so Supabase gateway accepts the request
//   const anon = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY ?? '';
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//     'x-notify-secret': process.env.NOTIFY_SECRET ?? '',
//   };
//   if (anon) {
//     headers['Authorization'] = `Bearer ${anon}`;
//     headers['apikey'] = anon;
//   }

//   fetch(`${process.env.SUPABASE_EDGE_NOTIFY_URL}`, {
//     method: 'POST',
//     headers,
//     body: JSON.stringify(payload),
//     cache: 'no-store',
//   })
//     .then((res) => {
//       if (!res.ok) {
//         console.error('Notify admin failed:', res.status, res.statusText);
//       }
//     })
//     .catch((e) => {
//       console.error('Notify admin error (fire-and-forget):', e);
//     });
// }

// export default async function AuthCallbackPage() {
//   const supabase = await createClient();
  
//   // récupérer l'utilisateur après le clic sur le lien magique
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
  
//   if (!user) {
//     // si pour une raison X il n'y a pas de user, on renvoie vers /login
//     redirect('/auth/login');
//   }

//  const metadata = (user.user_metadata ?? {});

//   const fullname: string | undefined = metadata.full_name;
//   const [firstFromFull, ...rest] = fullname ? fullname.split(" ") : [];
//   const lastFromFull = rest.length ? rest.join(" ") : null;

//   const firstname = metadata.given_name || firstFromFull || "N/C";

//   const lastname = metadata.family_name || lastFromFull || "N/C";

//   const avatar_url = metadata.avatar_url ?? null;

//   // Use admin client to bypass RLS when creating profile

//    // 2) s'assurer que le profil existe dans `public.users`
//   const { error: upsertError } = await supabase.from("users").upsert(
//     {
//       id: user.id,
//       firstname,
//       lastname,
//       avatar_url,
//       role: "developer",
//       is_public: true,
//       is_approved: false, // par défaut en attente
//     },
//     {
//       onConflict: "id",
//     },
//   );

//   if (upsertError) {
//     console.error('Error upserting profile', upsertError);
//   }

//   // 2) notifier l’admin via Edge Function (non-blocking)
//   notifyAdmin(user.email ?? '', user.id);

//   // 3) afficher un message à l’utilisateur
//   return (
//     <main className="max-w-lg mx-auto pt-16">
//       <h1 className="text-2xl font-semibold mb-4">
//         Ton email est confirmé 🎉
//       </h1>
//       <p className="mb-2">
//         Ton compte est bien créé, il est maintenant en attente de validation
//         par l’administrateur.
//       </p>
//       <p className="text-sm text-gray-500">
//         Tu recevras un accès complet une fois que ton compte aura été approuvé.
//       </p>
//     </main>
//   );
// }