import type { Metadata } from "next";
import { AdminProvider } from "@/components/admin/AdminContext";

export const metadata: Metadata = {
  title: "Yönetim Paneli — Çanakkale Uzman",
  robots: { index: false, follow: false },
};

// Tüm /admin/* sayfaları AdminProvider kapısından geçer (oturum + rol).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
