"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AdminContext";
import {
  getSetting, setSetting, listStaff, upsertStaff, deactivateStaff, logAdminAction,
  ROLE_LABELS, type StaffMember, type StaffRole,
} from "@/lib/adminPanel";
import { AdminCard, Badge, Btn, PageTitle, useConfirm } from "@/components/admin/ui";

// Sistem ayarları + personel (rol) yönetimi.
// API anahtarları/sırlar burada TUTULMAZ — yalnızca env'de (Vercel) yaşar.

type SiteConfig = {
  registrationsOpen: boolean;
  expertApplicationsOpen: boolean;
  maintenanceNote: string;
  contactEmail: string;
  gaId: string;   // Google Analytics ID (gizli değil)
  gtmId: string;  // Tag Manager ID (gizli değil)
};

const DEFAULTS: SiteConfig = {
  registrationsOpen: true,
  expertApplicationsOpen: true,
  maintenanceNote: "",
  contactEmail: "info@canakkaleuzman.com",
  gaId: "",
  gtmId: "",
};

export default function AyarlarPage() {
  const { role } = useAdmin();
  const [cfg, setCfg] = useState<SiteConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const { confirm, modal } = useConfirm();

  // Personel yönetimi (yalnızca super_admin görür/yönetir; RLS de uygular).
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [newStaff, setNewStaff] = useState({ userId: "", email: "", role: "moderator" as Exclude<StaffRole, "super_admin"> });
  const [staffMsg, setStaffMsg] = useState<string | null>(null);

  useEffect(() => {
    getSetting<SiteConfig>("site_config", DEFAULTS).then((v) => setCfg({ ...DEFAULTS, ...v }));
    listStaff().then(setStaff);
  }, []);

  async function save() {
    if (!cfg) return;
    setBusy(true);
    const res = await setSetting("site_config", cfg);
    await logAdminAction({ action: "settings.update", targetType: "site_settings", targetId: "site_config", newData: cfg, result: res.ok ? "success" : "failure" });
    setBusy(false);
    setSaved(res.ok);
    setTimeout(() => setSaved(false), 2500);
  }

  async function addStaff() {
    setStaffMsg(null);
    if (!newStaff.userId.trim() || !newStaff.email.trim()) {
      setStaffMsg("Kullanıcı ID (Supabase Auth UUID) ve e-posta zorunlu.");
      return;
    }
    setBusy(true);
    const res = await upsertStaff(newStaff.userId.trim(), newStaff.email.trim(), newStaff.role);
    await logAdminAction({ action: "staff.upsert", targetType: "admin_staff", targetId: newStaff.userId, newData: newStaff, result: res.ok ? "success" : "failure" });
    if (res.ok) {
      setStaff(await listStaff());
      setNewStaff({ userId: "", email: "", role: "moderator" });
      setStaffMsg("Personel kaydedildi. (Kullanıcının önce siteye kayıt olmuş olması gerekir; UUID'yi Kullanıcılar sayfasından kopyalayabilirsin.)");
    } else {
      setStaffMsg(res.error ?? "Kaydedilemedi (yalnızca Super Admin personel yönetebilir).");
    }
    setBusy(false);
  }

  const inp = "h-10 w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm outline-none focus:border-[#c99a53]";

  return (
    <div>
      <PageTitle title="Ayarlar" desc="Site genel ayarları ve yönetim ekibi rolleri. API anahtarları güvenlik gereği yalnızca ortam değişkenlerinde (Vercel env) tutulur, burada gösterilmez." />

      {cfg && (
        <AdminCard className="mb-4">
          <h3 className="font-display text-[1.05rem] font-semibold text-[#0d2c4b]">Site ayarları</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cfg.registrationsOpen} onChange={(e) => setCfg({ ...cfg, registrationsOpen: e.target.checked })} className="h-4 w-4 accent-[#0d2c4b]" /> Yeni kayıtlar açık</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cfg.expertApplicationsOpen} onChange={(e) => setCfg({ ...cfg, expertApplicationsOpen: e.target.checked })} className="h-4 w-4 accent-[#0d2c4b]" /> Uzman başvuruları açık</label>
            <label className="text-xs">İletişim e-postası<input value={cfg.contactEmail} onChange={(e) => setCfg({ ...cfg, contactEmail: e.target.value })} className={inp} /></label>
            <label className="text-xs">Bakım notu (doluysa sitede duyuru şeridi)<input value={cfg.maintenanceNote} onChange={(e) => setCfg({ ...cfg, maintenanceNote: e.target.value })} className={inp} /></label>
            <label className="text-xs">Google Analytics ID<input value={cfg.gaId} onChange={(e) => setCfg({ ...cfg, gaId: e.target.value })} placeholder="G-XXXXXXX" className={inp} /></label>
            <label className="text-xs">Google Tag Manager ID<input value={cfg.gtmId} onChange={(e) => setCfg({ ...cfg, gtmId: e.target.value })} placeholder="GTM-XXXXXXX" className={inp} /></label>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Btn tone="navy" disabled={busy} onClick={save}>Kaydet</Btn>
            {saved && <span className="text-sm text-[#1e7d4f]">Kaydedildi ✓</span>}
          </div>
        </AdminCard>
      )}

      <AdminCard>
        <h3 className="font-display text-[1.05rem] font-semibold text-[#0d2c4b]">Yönetim ekibi (RBAC)</h3>
        <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">
          Roller: Super Admin (dokunulmaz), Admin, Editör, Moderatör, Destek, Finans, SEO.
          Rol yetkileri veritabanı seviyesinde (RLS) uygulanır. Yalnızca Super Admin ekleyip çıkarabilir.
        </p>
        <ul className="mt-3 space-y-2">
          {staff.map((s) => (
            <li key={s.userId} className="flex flex-wrap items-center justify-between gap-2 rounded-[8px] bg-[#f6f3ed] px-3 py-2 text-sm">
              <span className="font-semibold text-[#0d2c4b]">{s.email}</span>
              <span className="flex items-center gap-2">
                <Badge text={ROLE_LABELS[s.role]} tone={s.role === "super_admin" ? "gold" : "navy"} />
                {!s.active && <Badge text="Pasif" tone="red" />}
                {role === "super_admin" && s.role !== "super_admin" && s.active && (
                  <Btn small tone="red" disabled={busy} onClick={async () => {
                    const r = await confirm({ title: "Yetkiyi kaldır", desc: `${s.email} panel erişimini kaybeder.`, danger: true });
                    if (r.ok) {
                      await deactivateStaff(s.userId);
                      await logAdminAction({ action: "staff.deactivate", targetType: "admin_staff", targetId: s.userId });
                      setStaff(await listStaff());
                    }
                  }}>Kaldır</Btn>
                )}
              </span>
            </li>
          ))}
        </ul>
        {role === "super_admin" && (
          <div className="mt-4 grid gap-2 border-t border-[rgba(16,40,68,0.08)] pt-4 sm:grid-cols-[1fr_1fr_auto_auto]">
            <input value={newStaff.userId} onChange={(e) => setNewStaff({ ...newStaff, userId: e.target.value })} placeholder="Kullanıcı UUID (Kullanıcılar sayfasından)" className={inp} />
            <input value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} placeholder="E-posta" className={inp} />
            <select value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as typeof newStaff.role })} className={inp}>
              {(Object.keys(ROLE_LABELS) as StaffRole[]).filter((r) => r !== "super_admin").map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            <Btn tone="navy" disabled={busy} onClick={addStaff}>Ekle</Btn>
          </div>
        )}
        {staffMsg && <p className="mt-2 text-xs text-[#7a4f1a]">{staffMsg}</p>}
      </AdminCard>
      {modal}
    </div>
  );
}
