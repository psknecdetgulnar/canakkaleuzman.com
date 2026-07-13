"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { signIn } from "@/lib/adminAuth";

// Panellerin oturum kapısı: giriş yoksa panel içeriği yerine bu form gösterilir.
// Başarılı girişte sayfa yenilenir (context oturumu yeniden okur).
export function PanelLogin({ panelName }: { panelName: string }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError("E-posta ve şifre zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await signIn(form.email, form.password);
    if (res.ok) {
      window.location.reload();
    } else {
      setBusy(false);
      setError(res.error ?? "Giriş başarısız.");
    }
  }

  return (
    <div className="mx-auto max-w-sm py-8">
      <h1 className="font-display text-[1.6rem] font-semibold text-[#0d2c4b]">{panelName} girişi</h1>
      <p className="mt-1 text-sm text-[#102844]">
        Paneli kullanmak için e-posta ve şifrenle giriş yap.
      </p>
      <form onSubmit={submit} className="mt-5 flex flex-col gap-3 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[rgba(16,40,68,0.6)]">E-posta</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
            className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[rgba(16,40,68,0.6)]">Şifre</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
          />
        </label>
        {error && <p className="text-sm text-[#b3261e]">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60] disabled:opacity-50"
        >
          {busy ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
      <p className="mt-4 text-sm text-[#102844]">
        Hesabın yok mu?{" "}
        <Link href="/" className="font-semibold text-[#0d2c4b] underline decoration-[#c99a53] underline-offset-4 hover:text-[#c99a53]">
          Ana sayfadan Kayıt Ol
        </Link>
      </p>
    </div>
  );
}
