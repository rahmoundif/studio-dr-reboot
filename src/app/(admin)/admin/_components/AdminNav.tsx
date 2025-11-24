"use client";
import { LogoutButton } from "@/app/auth/_components/_buttons/signOut";

export default function AdminNav() {
  return (
    <aside className="w-56 bg-gray-800 h-screen p-4 flex flex-col gap-4 text-gray-300">
      <h2 className="text-xl font-bold mb-4 text-white">Studio DR</h2>

      <a href="/admin" className="hover:text-white">
        Tableau de bord
      </a>

      <a href="/admin/profil" className="hover:text-white">
        Profil
      </a>

      <a href="/admin/section" className="hover:text-white">
        Sections
      </a>

      <LogoutButton />
    </aside>
  );
}
