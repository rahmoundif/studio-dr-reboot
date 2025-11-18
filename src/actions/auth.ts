// "use server";

// import { createClient } from "@/lib/server";

// /**
//  * Met à jour le statut de l'utilisateur après la première connexion
//  * Exemple: marquer comme "onboarded", sauvegarder la date de première connexion, etc.
//  */
// export async function updateUserStatusAfterLogin() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError || !user) {
//     console.error(
//       "Erreur lors de la récupération de l'utilisateur:",
//       userError
//     );
//     return { error: "User not found" };
//   }

//   // Exemple: mettre à jour les métadonnées de l'utilisateur
//   const { data, error } = await supabase.auth.updateUser({
//     data: {
//       onboarded: true,
//       first_login_at:
//         user.created_at === user.last_sign_in_at
//           ? new Date().toISOString()
//           : undefined,
//       status: "active",
//     },
//   });

//   if (error) {
//     console.error("Erreur lors de la mise à jour du statut:", error);
//     return { error: error.message };
//   }

//   console.log("✅ Statut utilisateur mis à jour:", data.user?.user_metadata);
//   return { success: true, user: data.user };
// }

// /**
//  * Vérifie si l'utilisateur a déjà complété l'onboarding
//  */
// export async function checkUserOnboarding() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser();

//   if (error || !user) {
//     return { onboarded: false };
//   }

//   return {
//     onboarded: user.user_metadata?.onboarded === true,
//     status: user.user_metadata?.status,
//   };
// }
