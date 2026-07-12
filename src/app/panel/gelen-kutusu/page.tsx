"use client";

import { useEffect, useState } from "react";
import { usePanelProfile } from "@/components/panel/PanelProfileContext";
import { ProfileSwitcher } from "@/components/panel/ProfileSwitcher";
import {
  getAppointments,
  updateAppointmentStatus,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/appointments";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "Bekliyor",
  confirmed: "Onaylandı",
  rejected: "Reddedildi",
  cancelled: "İptal",
};

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  pending: "bg-[#c99a53] text-[#fffdf9]",
  confirmed: "bg-[#0d2c4b] text-[#fffdf9]",
  rejected: "border border-[rgba(16,40,68,0.2)] text-[rgba(16,40,68,0.6)]",
  cancelled: "border border-[rgba(16,40,68,0.2)] text-[rgba(16,40,68,0.6)]",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// Uzmanın "Randevu talep et" formundan (ProfileView) gelen talepleri gördüğü
// gelen kutusu. Daha önce bu talepler hiçbir yerde görüntülenmiyordu — sadece
// veritabanına düşüyordu (Görev 4).
export default function GelenKutusuPage() {
  const { activeSlug, loading: profileLoading } = usePanelProfile();
  const [items, setItems] = useState<Appointment[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeSlug) return;
    let active = true;
    setItems(null);
    getAppointments(activeSlug).then((rows) => {
      if (active) setItems(rows);
    });
    return () => {
      active = false;
    };
  }, [activeSlug]);

  async function setStatus(id: string, status: AppointmentStatus) {
    setBusyId(id);
    const res = await updateAppointmentStatus(id, status);
    if (res.ok) {
      setItems((prev) => prev?.map((a) => (a.id === id ? { ...a, status } : a)) ?? prev);
    }
    setBusyId(null);
  }

  const pendingCount = items?.filter((a) => a.status === "pending").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Gelen kutusu</h1>
        <p className="mt-1 text-sm text-[#102844]">
          Profilindeki randevu formundan gelen talepler burada listelenir. Bu paneli kullanmak isteğe
          bağlıdır — talep geldiğinde ziyaretçiyle doğrudan telefon/WhatsApp üzerinden de iletişime
          geçebilirsin.
        </p>
      </div>

      <ProfileSwitcher />

      {profileLoading || items === null ? (
        <div className="h-40 animate-pulse rounded-[14px] bg-[#f3eee6]" />
      ) : items.length === 0 ? (
        <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-5 py-10 text-center text-[#102844]">
          Henüz randevu talebi yok. Bir ziyaretçi profilindeki &ldquo;Randevu talep et&rdquo; formunu
          doldurduğunda burada görünecek.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pendingCount > 0 && (
            <p className="text-sm font-semibold text-[#0d2c4b]">{pendingCount} yeni talep bekliyor.</p>
          )}
          {items.map((a) => (
            <div
              key={a.id}
              className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[1.1rem] font-semibold text-[#0d2c4b]">{a.visitorName}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[a.status]}`}>
                      {STATUS_LABEL[a.status]}
                    </span>
                  </div>
                  <a href={`tel:${a.visitorPhone.replace(/\s/g, "")}`} className="text-sm text-[#102844] hover:text-[#c99a53]">
                    {a.visitorPhone}
                  </a>
                  {(a.day || a.time) && (
                    <p className="mt-1 text-sm text-[rgba(16,40,68,0.7)]">
                      Talep edilen zaman: {[a.day, a.time].filter(Boolean).join(" ")}
                    </p>
                  )}
                  {a.note && <p className="mt-2 text-sm text-[#102844]">&ldquo;{a.note}&rdquo;</p>}
                </div>
                <span className="shrink-0 text-xs text-[rgba(16,40,68,0.5)]">{formatDate(a.createdAt)}</span>
              </div>

              {a.status === "pending" && (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-[rgba(16,40,68,0.08)] pt-4">
                  <button
                    type="button"
                    disabled={busyId === a.id}
                    onClick={() => setStatus(a.id, "confirmed")}
                    className="rounded-[6px] bg-[#0d2c4b] px-4 py-2 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60] disabled:opacity-50"
                  >
                    Onayla
                  </button>
                  <button
                    type="button"
                    disabled={busyId === a.id}
                    onClick={() => setStatus(a.id, "rejected")}
                    className="rounded-[6px] border border-[rgba(16,40,68,0.2)] px-4 py-2 text-sm font-semibold text-[#102844] transition-colors hover:border-[#c99a53] disabled:opacity-50"
                  >
                    Reddet
                  </button>
                  <a
                    href={`https://wa.me/${a.visitorPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[6px] border border-[rgba(16,40,68,0.2)] px-4 py-2 text-sm font-semibold text-[#102844] transition-colors hover:border-[#c99a53]"
                  >
                    WhatsApp&apos;tan yaz
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
