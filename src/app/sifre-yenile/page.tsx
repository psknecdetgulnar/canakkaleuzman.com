"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { sb } from "@/lib/supabaseClient";

// Şifre yenileme: e-postadaki sıfırlama bağlantısı buraya yönlendirir.
// Supabase recovery oturumu açar; kullanıcı yeni şifresini belirler.
export default function SifreYenilePage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sb) return;
    // Recovery bağlantısı oturumu otomatik açar; oturum var mı diye bak.
    sb.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!sb || password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await sb.auth.updateUser({ password });
    setBusy(false);
    if (err) setError("Şifre güncellenemedi. Bağlantının süresi dolmuş olabilir — yeniden sıfırlama iste.");
    else setDone(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffdf9] px-4">
      <div className="w-full max-w-sm rounded-[16px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-6 shadow-[0_20px_60px_rgba(13,44,75,0.10)]">
        <h1 className="font-display text-[1.5rem] font-semibold text-[#0d2c4b]">Yeni şifre belirle</h1>
        {done ? (
          <div className="mt-4 text-sm leading-6 text-[#102844]">
            <p className="font-semibold text-[#1e7d4f]">Şifren güncellendi ✓</p>
            <Link href="/panel" className="mt-3 inline-block rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] hover:bg-[#143a60]">
              Panele git →
            </Link>
          </div>
        ) : !ready ? (
          <p className="mt-3 text-sm leading-6 text-[#102844]">
            Bu sayfa, e-postana gelen şifre sıfırlama bağlantısıyla açılmalıdır. Bağlantı
            gelmediyse giriş ekranındaki &ldquo;Şifremi unuttum&rdquo;u kullan.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yeni şifre (en az 6 karakter)"
              required
              className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm outline-none focus:border-[#c99a53]"
            />
            {error && <p className="text-sm text-[#b3261e]">{error}</p>}
            <button type="submit" disabled={busy} className="rounded-[6px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] hover:bg-[#143a60] disabled:opacity-50">
              {busy ? "Güncelleniyor…" : "Şifreyi güncelle"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
