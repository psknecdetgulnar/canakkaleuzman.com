"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ShareCard, SHARE_SIZES, type ShareFormat } from "./ShareCard";
import { expertPhoto, avatarUri } from "@/lib/avatar";
import { profileUrl } from "@/lib/site";

// "Profili Paylaş" modalı: canlı önizleme + Story/Post seçimi +
// Instagram'da Paylaş (Web Share API) / Görseli İndir / Bağlantıyı Kopyala.
// Görsel, gizli tam-boyut node'dan html-to-image ile birebir 1080px PNG
// olarak üretilir (ekran görüntüsü kalitesinin çok üstünde).

type Props = {
  open: boolean;
  onClose: () => void;
  slug: string;
  name: string;
  title: string;
  district: string;
  expertise: string[];
  bio: string;
};

// Dış kaynaklı profil fotoğrafını data-URL'e çevirir (CORS-güvenli yakalama).
// Başarısız olursa her zaman çalışan yerel SVG avatara düşer.
async function photoAsDataUrl(name: string): Promise<string> {
  try {
    const res = await fetch(expertPhoto(name), { mode: "cors" });
    if (!res.ok) throw new Error("foto yüklenemedi");
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  } catch {
    return avatarUri(name);
  }
}

export function ShareProfileModal({ open, onClose, slug, name, title, district, expertise, bio }: Props) {
  const [format, setFormat] = useState<ShareFormat>("story");
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "share" | "download">(null);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement | null>(null);

  const pageUrl = profileUrl(slug);
  const profileHost = pageUrl.replace(/^https?:\/\//, "");

  // Modal açılınca foto + QR hazırla (bir kez).
  useEffect(() => {
    if (!open) return;
    let active = true;
    photoAsDataUrl(name).then((src) => active && setPhotoSrc(src));
    import("qrcode").then((QRCode) =>
      QRCode.toDataURL(pageUrl, { width: 480, margin: 1, color: { dark: "#0d2c4b", light: "#ffffff" } })
        .then((url) => active && setQrDataUrl(url))
    );
    return () => {
      active = false;
    };
  }, [open, name, pageUrl]);

  // Modal açıkken arka plan kaydırmasını kilitle; Esc ile kapan.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const ready = Boolean(photoSrc && qrDataUrl);
  const { w, h } = SHARE_SIZES[format];

  // Önizleme ölçeği: dar ekranda da sığsın.
  const previewW = format === "story" ? 250 : 290;
  const scale = previewW / w;

  const cardProps = useMemo(
    () => ({ format, name, title, district, expertise, bio, profileHost, photoSrc: photoSrc ?? "", qrDataUrl: qrDataUrl ?? "" }),
    [format, name, title, district, expertise, bio, profileHost, photoSrc, qrDataUrl]
  );

  async function renderPng(): Promise<Blob | null> {
    const node = captureRef.current;
    if (!node) return null;
    const { toBlob } = await import("html-to-image");
    // pixelRatio 1 → node zaten natif 1080px; birebir, kayıpsız çıktı.
    return toBlob(node, { width: w, height: h, pixelRatio: 1, cacheBust: true, backgroundColor: "#0d2c4b" });
  }

  async function handleShare() {
    if (!ready || busy) return;
    setBusy("share");
    setNotice(null);
    try {
      const blob = await renderPng();
      if (!blob) throw new Error("Görsel üretilemedi");
      const file = new File([blob], `canakkaleuzman-${slug}-${format}.png`, { type: "image/png" });
      if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${name} — Çanakkale Uzman`, text: pageUrl });
      } else {
        // Web Share desteklenmiyorsa (masaüstü) görseli indir.
        downloadBlob(blob);
        setNotice("Cihazın doğrudan paylaşımı desteklemiyor — görsel indirildi; Instagram'a galeriden yükleyebilirsin.");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setNotice("Paylaşım başarısız oldu, görseli indirip elle paylaşabilirsin.");
    }
    setBusy(null);
  }

  function downloadBlob(blob: Blob) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `canakkaleuzman-${slug}-${format}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  async function handleDownload() {
    if (!ready || busy) return;
    setBusy("download");
    setNotice(null);
    try {
      const blob = await renderPng();
      if (blob) downloadBlob(blob);
    } catch {
      setNotice("Görsel üretilemedi, lütfen tekrar dene.");
    }
    setBusy(null);
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setNotice(`Bağlantı: ${pageUrl}`);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(8,29,51,0.6)] backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[20px] bg-[#fffdf9] p-5 shadow-[0_-20px_60px_rgba(0,0,0,0.3)] sm:rounded-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[1.3rem] font-semibold text-[#0d2c4b]">Profili Paylaş</h2>
          <button type="button" onClick={onClose} aria-label="Kapat" className="flex h-9 w-9 items-center justify-center rounded-full text-[rgba(16,40,68,0.5)] hover:bg-[#f3eee6] hover:text-[#0d2c4b]">
            ✕
          </button>
        </div>

        {/* Format seçimi */}
        <div className="mt-4 flex gap-2 rounded-[8px] bg-[#f3eee6] p-1">
          {([["story", "Story · 1080×1920"], ["post", "Post · 1080×1350"]] as [ShareFormat, string][]).map(([f, label]) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              className={`flex-1 rounded-[6px] px-3 py-2 text-sm font-semibold transition-colors ${
                format === f ? "bg-[#0d2c4b] text-[#fffdf9]" : "text-[#102844] hover:text-[#0d2c4b]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Canlı önizleme */}
        <div className="mt-4 flex justify-center rounded-[14px] bg-[#f3eee6] py-5">
          {ready ? (
            <div style={{ width: previewW, height: h * scale, overflow: "hidden", borderRadius: 12, boxShadow: "0 12px 40px rgba(13,44,75,0.3)" }}>
              <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
                <ShareCard {...cardProps} />
              </div>
            </div>
          ) : (
            <div className="flex h-[440px] w-[250px] animate-pulse items-center justify-center rounded-[12px] bg-[#e5ded2] text-sm text-[rgba(16,40,68,0.5)]">
              Kart hazırlanıyor…
            </div>
          )}
        </div>

        {notice && <p className="mt-3 rounded-[8px] bg-[#fdf3e9] px-3 py-2 text-xs leading-5 text-[#7a4f1a]">{notice}</p>}

        {/* Aksiyonlar */}
        <div className="mt-4 grid gap-2">
          <button
            type="button"
            disabled={!ready || busy !== null}
            onClick={handleShare}
            className="rounded-[8px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60] disabled:opacity-50"
          >
            {busy === "share" ? "Hazırlanıyor…" : "📸 Instagram'da Paylaş"}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!ready || busy !== null}
              onClick={handleDownload}
              className="rounded-[8px] border border-[rgba(16,40,68,0.2)] px-4 py-3 text-sm font-semibold text-[#102844] transition-colors hover:border-[#c99a53] disabled:opacity-50"
            >
              {busy === "download" ? "İndiriliyor…" : "Görseli İndir"}
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-[8px] border border-[rgba(16,40,68,0.2)] px-4 py-3 text-sm font-semibold text-[#102844] transition-colors hover:border-[#c99a53]"
            >
              {copied ? "Kopyalandı ✓" : "Bağlantıyı Kopyala"}
            </button>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-[rgba(16,40,68,0.5)]">
          Yüksek çözünürlüklü PNG ({w}×{h}) — Instagram {format === "story" ? "Story" : "gönderi"} boyutunda.
        </p>
      </div>

      {/* Gizli tam-boyut yakalama node'u (1080px natif) */}
      {ready && (
        <div style={{ position: "fixed", left: -20000, top: 0, pointerEvents: "none" }} aria-hidden="true">
          <div ref={captureRef}>
            <ShareCard {...cardProps} />
          </div>
        </div>
      )}
    </div>
  );
}
