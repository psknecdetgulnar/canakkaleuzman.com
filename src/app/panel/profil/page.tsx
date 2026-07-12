"use client";

import { useEffect, useState } from "react";
import { districts } from "@/data/categories";
import type { ExpertProfile, ProfileSectionKey } from "@/data/experts";
import { getExpertProfileBySlug } from "@/lib/db";
import {
  loadProfileOverride,
  saveProfileOverride,
  clearProfileOverride,
  type ProfileOverride,
  type CalendarSlot,
} from "@/lib/profileStore";
import { usePanelProfile } from "@/components/panel/PanelProfileContext";
import { ProfileSwitcher } from "@/components/panel/ProfileSwitcher";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const DAY_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const SECTIONS: { key: ProfileSectionKey; label: string }[] = [
  { key: "about", label: "Hakkımda" },
  { key: "expertise", label: "Uzmanlık Alanlarım" },
  { key: "reviews", label: "Müşteri Yorumları" },
  { key: "portfolio", label: "Portföyüm" },
];

type Form = {
  name: string;
  title: string;
  firm: string;
  district: string;
  phone: string;
  whatsapp: string;
  email: string;
  longBio: string; // paragraflar boş satırla ayrılır
  expertiseAreas: string; // her satır bir alan
  visibility: Record<ProfileSectionKey, boolean>;
  sectionLabels: Record<ProfileSectionKey, string>;
  calendarEnabled: boolean;
  slots: CalendarSlot[];
};

const DEFAULT_LABELS: Record<ProfileSectionKey, string> = {
  about: "Hakkımda",
  expertise: "Uzmanlık Alanlarım",
  reviews: "Müşteri Yorumları",
  portfolio: "Portföyüm",
};

// Profil düzenleme ekranı — Görev 3 düzeltmeleri:
// 1) Statik data/experts.ts yerine Supabase (lib/db) kullanılır; panel artık
//    canlı /uzman sayfasıyla AYNI veri kaynağını görür.
// 2) Sitenin geri kalanıyla aynı lacivert/krem tasarım dili.
// 3) "İleride Supabase'e bağlanacak" gibi güncelliğini yitirmiş metin kaldırıldı.
// 4) İlçe artık serbest metin değil, sitedeki gerçek ilçe listesinden seçilir.
// 5) Kategori salt-okunur gösterilir (unvan ile karışmasın diye).
export default function ProfilPanel() {
  const { activeSlug } = usePanelProfile();
  const [base, setBase] = useState<ExpertProfile | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!activeSlug) return;
    let active = true;
    setForm(null);
    setBase(null);
    Promise.all([getExpertProfileBySlug(activeSlug), loadProfileOverride(activeSlug)]).then(
      ([profile, ov]) => {
        if (!active || !profile) return;
        setBase(profile);
        const f = ov?.fields ?? {};
        setForm({
          name: f.name ?? profile.name,
          title: f.title ?? profile.title,
          firm: f.firm ?? profile.firm ?? "",
          district: f.district ?? profile.district,
          phone: f.phone ?? profile.phone ?? "",
          whatsapp: f.whatsapp ?? profile.whatsapp ?? "",
          email: f.email ?? profile.email ?? "",
          longBio: (f.longBio ?? profile.longBio).join("\n\n"),
          expertiseAreas: (f.expertiseAreas ?? profile.expertiseAreas).join("\n"),
          visibility: { ...profile.visibility, ...(ov?.visibility ?? {}) },
          sectionLabels: { ...DEFAULT_LABELS, ...(ov?.sectionLabels ?? {}) },
          calendarEnabled: ov?.calendar?.enabled ?? false,
          slots: ov?.calendar?.slots ?? [],
        });
        setSaved(false);
      }
    );
    return () => {
      active = false;
    };
  }, [activeSlug]);

  if (!activeSlug || !form || !base) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-2xl font-semibold text-[#0d2c4b]">Profil düzenle</h1>
        <div className="h-64 animate-pulse rounded-[14px] bg-[#f3eee6]" />
      </div>
    );
  }

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  }

  async function save() {
    // Ekstra güvenlik: readOnly UI'ı bypass edilse bile free profilde iletişim
    // alanları kaydedilmez — her zaman orijinal (base) değerine sabitlenir.
    const data: ProfileOverride = {
      fields: {
        name: form!.name.trim(),
        title: form!.title.trim(),
        firm: form!.firm.trim() || null,
        district: form!.district.trim(),
        phone: base!.premium ? form!.phone.trim() || null : base!.phone,
        whatsapp: base!.premium ? form!.whatsapp.replace(/\D/g, "") || null : base!.whatsapp,
        email: base!.premium ? form!.email.trim() || null : base!.email,
        longBio: form!.longBio.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean),
        expertiseAreas: form!.expertiseAreas.split("\n").map((s) => s.trim()).filter(Boolean),
      },
      visibility: form!.visibility,
      sectionLabels: form!.sectionLabels,
      calendar: { enabled: form!.calendarEnabled, slots: form!.slots },
    };
    await saveProfileOverride(activeSlug!, data);
    setSaved(true);
  }

  const visibleCount = SECTIONS.filter((s) => form.visibility[s.key]).length;
  function toggleVisibility(key: ProfileSectionKey) {
    const willHide = form!.visibility[key];
    if (willHide && visibleCount <= 1) return; // son açık sekme kapatılamaz
    set("visibility", { ...form!.visibility, [key]: !form!.visibility[key] });
  }

  function addSlot(day: string, time: string) {
    if (!time) return;
    if (form!.slots.some((s) => s.day === day && s.time === time)) return;
    set("slots", [...form!.slots, { day, time }]);
  }
  function removeSlot(i: number) {
    set("slots", form!.slots.filter((_, idx) => idx !== i));
  }
  // Takvim ızgarasında bir hücreye tıklamak: yoksa ekler, varsa kaldırır —
  // uzman müsaitliğini tamamen manuel, tek tıkla kontrol eder.
  function toggleGridSlot(day: string, time: string) {
    const idx = form!.slots.findIndex((s) => s.day === day && s.time === time);
    if (idx >= 0) removeSlot(idx);
    else addSlot(day, time);
  }

  async function reset() {
    await clearProfileOverride(activeSlug!);
    setForm({
      name: base!.name, title: base!.title, firm: base!.firm ?? "", district: base!.district,
      phone: base!.phone ?? "", whatsapp: base!.whatsapp ?? "", email: base!.email ?? "",
      longBio: base!.longBio.join("\n\n"), expertiseAreas: base!.expertiseAreas.join("\n"),
      visibility: base!.visibility,
      sectionLabels: DEFAULT_LABELS,
      calendarEnabled: false, slots: [],
    });
    setSaved(false);
  }

  return (
    <div className="flex max-w-[720px] flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#0d2c4b]">Profil düzenle</h1>
        <p className="mt-2 text-sm text-[#102844]">
          Değişiklikler kaydettiğinde doğrudan yayındaki profiline yansır. Hiçbir alanı doldurmasan da
          profilin, mevcut bilgilerinle otomatik olarak yayında kalır — bu ekran tamamen isteğe bağlıdır.
        </p>
      </div>

      <ProfileSwitcher />

      <div className="rounded-[10px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-4 py-3 text-sm text-[#102844]">
        <span className="font-semibold text-[#0d2c4b]">Kategori:</span> {base.categoryLabel}
        <span className="ml-2 text-[rgba(16,40,68,0.6)]">
          (unvanına göre otomatik atanır; değiştirmek için destek ile iletişime geç)
        </span>
      </div>

      {/* Üyelik durumu: iletişim/dönüşüm alanları yalnızca premium'da açık */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-[10px] border px-4 py-3 text-sm ${
          base.premium
            ? "border-[#c99a53]/40 bg-[#c99a53]/10 text-[#0d2c4b]"
            : "border-[rgba(16,40,68,0.10)] bg-[#f3eee6] text-[#102844]"
        }`}
      >
        <span>
          <span className="font-semibold text-[#0d2c4b]">
            {base.premium ? "🔒 Premium profil" : "Ücretsiz profil"}
          </span>{" "}
          {base.premium
            ? "— telefon, WhatsApp, e-posta ve sosyal linklerin ziyaretçilere açık ve buradan düzenlenebilir."
            : "— telefon, WhatsApp ve e-posta ziyaretçilere gösterilmez; bu alanlar premium'da açılır ve düzenlenebilir hale gelir."}
        </span>
        {!base.premium && (
          <button
            type="button"
            className="shrink-0 rounded-[6px] bg-[#c99a53] px-4 py-2 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#b98742]"
            onClick={() => alert("Premium üyelik yakında! Şimdilik profilin ücretsiz olarak yayında kalır.")}
          >
            Premium'a yükselt
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad soyad" value={form.name} onChange={(v) => set("name", v)} />
        <Field label="Ünvan" value={form.title} onChange={(v) => set("title", v)} />
        <Field label="Firma / ofis" value={form.firm} onChange={(v) => set("firm", v)} />
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[rgba(16,40,68,0.6)]">İlçe</span>
          <select
            value={form.district}
            onChange={(e) => set("district", e.target.value)}
            className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
          >
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>
        <Field
          label="Telefon"
          value={form.phone}
          onChange={(v) => set("phone", v)}
          readOnly={!base.premium}
          lockedNote="Telefon numarası premium üyelikte düzenlenebilir."
        />
        <Field
          label="WhatsApp (numara)"
          value={form.whatsapp}
          onChange={(v) => set("whatsapp", v)}
          readOnly={!base.premium}
          lockedNote="WhatsApp numarası premium üyelikte düzenlenebilir."
        />
        <Field
          label="E-posta"
          value={form.email}
          onChange={(v) => set("email", v)}
          readOnly={!base.premium}
          lockedNote="E-posta premium üyelikte düzenlenebilir."
        />
      </div>

      <Area label="Hakkımda (paragraflar boş satırla ayrılır)" value={form.longBio} onChange={(v) => set("longBio", v)} rows={6} />
      <Area label="Uzmanlık alanları (her satır bir alan)" value={form.expertiseAreas} onChange={(v) => set("expertiseAreas", v)} rows={5} />

      {/* Bölüm başlıkları + görünürlük (en az 1, en fazla 4 sekme) */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0d2c4b]">
          Sekmeler — başlık ve görünürlük
        </h2>
        <p className="mt-2 text-xs text-[rgba(16,40,68,0.6)]">
          Başlıkları dilediğin gibi adlandır. En az 1, en fazla 4 sekme görünür olabilir. Şu an açık: {visibleCount}/4.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {SECTIONS.map((s) => (
            <div key={s.key} className="flex items-center gap-3 border-b border-[rgba(16,40,68,0.08)] py-2">
              <input
                value={form.sectionLabels[s.key]}
                onChange={(e) => set("sectionLabels", { ...form.sectionLabels, [s.key]: e.target.value })}
                placeholder={s.label}
                className="h-10 flex-1 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
              />
              <button
                type="button"
                onClick={() => toggleVisibility(s.key)}
                disabled={form.visibility[s.key] && visibleCount <= 1}
                className={`shrink-0 rounded-[6px] border px-3 py-2 text-sm font-semibold ${
                  form.visibility[s.key]
                    ? "border-[#0d2c4b] bg-[#0d2c4b] text-[#fffdf9]"
                    : "border-[rgba(16,40,68,0.2)] text-[rgba(16,40,68,0.6)]"
                } disabled:opacity-40`}
              >
                {form.visibility[s.key] ? "Herkese açık" : "Gizli"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Randevu takvimi */}
      <div>
        <div className="flex items-center justify-between gap-4 border-b border-[rgba(16,40,68,0.08)] pb-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0d2c4b]">Randevu takvimi</h2>
          <button
            type="button"
            onClick={() => set("calendarEnabled", !form.calendarEnabled)}
            className={`rounded-[6px] border px-3 py-1.5 text-sm font-semibold ${
              form.calendarEnabled
                ? "border-[#0d2c4b] bg-[#0d2c4b] text-[#fffdf9]"
                : "border-[rgba(16,40,68,0.2)] text-[rgba(16,40,68,0.6)]"
            }`}
          >
            {form.calendarEnabled ? "Profilde görünür" : "Kapalı"}
          </button>
        </div>

        {form.calendarEnabled && (
          <div className="mt-4">
            <p className="text-xs text-[rgba(16,40,68,0.6)]">
              Müsait olduğun saatlere tıkla — anında işaretlenir. Standart olmayan bir saat için aşağıdaki
              &ldquo;özel saat ekle&rdquo; alanını kullanabilirsin.
            </p>

            {/* Haftalık takvim ızgarası — tam manuel kontrol: bir hücreye tıklamak
                o gün+saati ekler/kaldırır. */}
            <div className="mt-3 overflow-x-auto rounded-[10px] border border-[rgba(16,40,68,0.10)]">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-16 border-b border-[rgba(16,40,68,0.10)] bg-[#f3eee6] p-2 text-xs font-semibold text-[rgba(16,40,68,0.6)]">
                      Saat
                    </th>
                    {DAYS.map((d, i) => (
                      <th key={d} className="border-b border-l border-[rgba(16,40,68,0.10)] bg-[#f3eee6] p-2 text-xs font-semibold text-[#0d2c4b]">
                        {DAY_SHORT[i]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((h) => (
                    <tr key={h}>
                      <td className="border-b border-[rgba(16,40,68,0.08)] p-2 text-center text-xs tabular-nums text-[rgba(16,40,68,0.6)]">
                        {h}
                      </td>
                      {DAYS.map((d) => {
                        const active = form!.slots.some((s) => s.day === d && s.time === h);
                        return (
                          <td key={d} className="border-b border-l border-[rgba(16,40,68,0.08)] p-1 text-center">
                            <button
                              type="button"
                              onClick={() => toggleGridSlot(d, h)}
                              aria-pressed={active}
                              aria-label={`${d} ${h} — ${active ? "müsait, kaldırmak için tıkla" : "müsait değil, eklemek için tıkla"}`}
                              className={`h-7 w-full rounded-[4px] transition-colors ${
                                active
                                  ? "bg-[#0d2c4b] hover:bg-[#143a60]"
                                  : "bg-[rgba(16,40,68,0.04)] hover:bg-[#f3eee6]"
                              }`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 border-t border-[rgba(16,40,68,0.08)] pt-4">
              <p className="text-xs font-semibold text-[rgba(16,40,68,0.6)]">Özel saat ekle</p>
              <div className="mt-2">
                <SlotAdder onAdd={addSlot} />
              </div>
            </div>

            {form.slots.length === 0 ? (
              <p className="mt-4 text-sm text-[rgba(16,40,68,0.6)]">Henüz saat eklenmedi.</p>
            ) : (
              <ul className="mt-4 flex flex-wrap gap-2">
                {form.slots.map((s, i) => (
                  <li key={`${s.day}-${s.time}-${i}`} className="flex items-center gap-2 rounded-full border border-[rgba(16,40,68,0.14)] px-3 py-1.5 text-sm text-[#102844]">
                    <span className="tabular-nums">{s.day} {s.time}</span>
                    <button type="button" onClick={() => removeSlot(i)} aria-label="Kaldır" className="text-[rgba(16,40,68,0.5)] hover:text-[#0d2c4b]">×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={save} className="rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]">
          Kaydet
        </button>
        <button onClick={reset} className="text-sm font-semibold text-[rgba(16,40,68,0.6)] hover:text-[#0d2c4b]">
          Varsayılana döndür
        </button>
        {saved && <span className="text-sm text-[#0d2c4b]">Kaydedildi.</span>}
      </div>
    </div>
  );
}

function SlotAdder({ onAdd }: { onAdd: (day: string, time: string) => void }) {
  const [day, setDay] = useState(DAYS[0]);
  const [time, setTime] = useState("");
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[rgba(16,40,68,0.6)]">Gün</span>
        <select value={day} onChange={(e) => setDay(e.target.value)} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]">
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[rgba(16,40,68,0.6)]">Saat</span>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm tabular-nums text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
      </label>
      <button
        type="button"
        onClick={() => { onAdd(day, time); setTime(""); }}
        className="rounded-[6px] bg-[#0d2c4b] px-4 py-2.5 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]"
      >
        Saat ekle
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly,
  lockedNote,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  lockedNote?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-[rgba(16,40,68,0.6)]">
        {label}
        {readOnly && <span className="ml-1 text-[#c99a53]">🔒 Premium</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        aria-readonly={readOnly}
        title={readOnly ? lockedNote : undefined}
        className={`h-11 rounded-[6px] border px-3 text-sm outline-none ${
          readOnly
            ? "cursor-not-allowed border-[rgba(16,40,68,0.10)] bg-[rgba(16,40,68,0.04)] text-[rgba(16,40,68,0.5)]"
            : "border-[rgba(16,40,68,0.14)] bg-[#fffdf9] text-[#0d2c4b] focus:border-[#c99a53]"
        }`}
      />
    </label>
  );
}

function Area({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-[rgba(16,40,68,0.6)]">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 py-2 text-sm leading-relaxed text-[#0d2c4b] outline-none focus:border-[#c99a53]" />
    </label>
  );
}
