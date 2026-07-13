"use client";

import { useState } from "react";

// Admin paneli ortak UI parçaları: kart, rozet, boş durum, onay modalı.

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4 shadow-[0_8px_24px_rgba(13,44,75,0.05)] ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ text, tone = "muted" }: { text: string; tone?: "navy" | "gold" | "red" | "green" | "muted" }) {
  const cls =
    tone === "navy" ? "bg-[#0d2c4b] text-[#fffdf9]"
    : tone === "gold" ? "bg-[#c99a53] text-[#fffdf9]"
    : tone === "red" ? "bg-[#b3261e] text-[#fffdf9]"
    : tone === "green" ? "bg-[#1e7d4f] text-[#fffdf9]"
    : "border border-[rgba(16,40,68,0.2)] text-[rgba(16,40,68,0.6)]";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{text}</span>;
}

export function Empty({ text }: { text: string }) {
  return <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-5 py-10 text-center text-[#102844]">{text}</div>;
}

export function PageTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-display text-[1.7rem] font-semibold text-[#0d2c4b]">{title}</h1>
      {desc && <p className="mt-1 max-w-[70ch] text-sm text-[#102844]">{desc}</p>}
    </div>
  );
}

export function Btn({
  children, onClick, tone = "outline", disabled, small,
}: {
  children: React.ReactNode; onClick?: () => void;
  tone?: "navy" | "gold" | "red" | "outline"; disabled?: boolean; small?: boolean;
}) {
  const size = small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const cls =
    tone === "navy" ? "bg-[#0d2c4b] text-[#fffdf9] hover:bg-[#143a60]"
    : tone === "gold" ? "border border-[#c99a53] text-[#c99a53] hover:bg-[#fdf3e9]"
    : tone === "red" ? "border border-[rgba(179,38,30,0.35)] text-[#b3261e] hover:bg-[rgba(179,38,30,0.06)]"
    : "border border-[rgba(16,40,68,0.2)] text-[#102844] hover:border-[#c99a53]";
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`rounded-[6px] font-semibold transition-colors disabled:opacity-50 ${size} ${cls}`}>
      {children}
    </button>
  );
}

// Kritik işlemler için onay modalı — isteğe bağlı gerekçe alanı.
export function useConfirm() {
  const [state, setState] = useState<null | {
    title: string; desc: string; danger?: boolean; withReason?: boolean;
    resolve: (v: { ok: boolean; reason?: string }) => void;
  }>(null);
  const [reason, setReason] = useState("");

  function confirm(opts: { title: string; desc: string; danger?: boolean; withReason?: boolean }) {
    return new Promise<{ ok: boolean; reason?: string }>((resolve) => {
      setReason("");
      setState({ ...opts, resolve });
    });
  }

  const modal = state ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,29,51,0.6)] p-4" onClick={() => { state.resolve({ ok: false }); setState(null); }}>
      <div className="w-full max-w-md rounded-[14px] bg-[#fffdf9] p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-[1.15rem] font-semibold text-[#0d2c4b]">{state.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#102844]">{state.desc}</p>
        {state.withReason && (
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Gerekçe (kullanıcıya iletilebilir)"
            className="mt-3 w-full rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] p-2.5 text-sm outline-none focus:border-[#c99a53]"
          />
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Btn onClick={() => { state.resolve({ ok: false }); setState(null); }}>Vazgeç</Btn>
          <Btn tone={state.danger ? "red" : "navy"} onClick={() => { state.resolve({ ok: true, reason: reason.trim() || undefined }); setState(null); }}>
            Onayla
          </Btn>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, modal };
}
