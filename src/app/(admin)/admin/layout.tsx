import type { ReactNode } from "react";
import AdminNav from "@/app/(admin)/admin/_components/AdminNav";
// import Protected from '@/app/(admin)/admin/_components/Protected';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 flex">
      <AdminNav />

      <section className="flex-1 p-6">{children}</section>
    </main>
  );
}
