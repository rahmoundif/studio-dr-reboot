"use client";

import ProfileEditor from "@/app/(admin)/admin/_components/ProfileEditor";

export default function ProfilPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mon profil</h1>
      <ProfileEditor />
    </div>
  );
}
