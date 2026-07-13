"use client";

// Instagram paylaşım kartı — dijital kimlik kartı görünümü.
// 1080×1920 (Story) veya 1080×1350 (Post) NATİF pikselde render edilir;
// önizlemede CSS transform ile küçültülür, html-to-image ile birebir
// bu boyutta PNG'ye çevrilir (kalite kaybı yok).
// Marka: koyu lacivert zemin + beyaz + turkuaz vurgu; düşük opaklıkta
// fener silüeti (mevcut marka görseli) ve yumuşak ışık halkaları.

export type ShareFormat = "story" | "post";

export const SHARE_SIZES: Record<ShareFormat, { w: number; h: number }> = {
  story: { w: 1080, h: 1920 },
  post: { w: 1080, h: 1350 },
};

const NAVY = "#0d2c4b";
const NAVY_DEEP = "#081d33";
const TURQ = "#2ec4b6";
const CREAM = "#fffdf9";

export type ShareCardProps = {
  format: ShareFormat;
  name: string;
  title: string;
  district: string;
  photoSrc: string;       // data-URL (CORS-güvenli) — modal hazırlar
  qrDataUrl: string;      // QR kodu data-URL
  expertise: string[];    // en fazla 3 gösterilir
  bio: string;
  profileHost: string;    // ör. ayse-demir.canakkaleuzman.com
};

export function ShareCard({ format, name, title, district, photoSrc, qrDataUrl, expertise, bio, profileHost }: ShareCardProps) {
  const { w, h } = SHARE_SIZES[format];
  const story = format === "story";

  // Uzun isim/unvanlarda taşmayı önleyen kademeli yazı boyutu.
  const nameSize = name.length > 22 ? 64 : name.length > 16 ? 76 : 88;
  const titleSize = title.length > 28 ? 40 : 48;
  const chips = expertise.filter(Boolean).slice(0, 3);
  const shortBio = bio.length > 140 ? `${bio.slice(0, 137).trimEnd()}…` : bio;

  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DEEP} 58%, #06263f 100%)`,
        fontFamily: "var(--font-body), 'Inter Tight', sans-serif",
        color: CREAM,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: story ? "110px 80px 90px" : "72px 80px 64px",
        boxSizing: "border-box",
      }}
    >
      {/* Yumuşak turkuaz ışık halkaları (soyut, sakin arka plan) */}
      <div style={{ position: "absolute", top: -220, right: -220, width: 640, height: 640, borderRadius: "50%", background: `radial-gradient(circle, ${TURQ}26 0%, transparent 65%)` }} />
      <div style={{ position: "absolute", bottom: story ? 260 : 160, left: -260, width: 720, height: 720, borderRadius: "50%", background: `radial-gradient(circle, ${TURQ}1f 0%, transparent 62%)` }} />
      {/* Şehir silüeti: fener — çok düşük opaklık, sağ alt */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/lighthouse.png"
        alt=""
        style={{ position: "absolute", right: 40, bottom: story ? 330 : 250, height: story ? 560 : 420, opacity: 0.07, filter: "brightness(3)" }}
      />

      {/* Üst: marka */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/lighthouse.png" alt="" style={{ height: 74, filter: "brightness(0) invert(1)", opacity: 0.95 }} />
        <div style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 40, fontWeight: 600, letterSpacing: 2, lineHeight: 1.05, textTransform: "uppercase" }}>
          Çanakkale<br />Uzman
        </div>
      </div>

      {/* Orta: foto + isim + unvan + ilçe */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div
          style={{
            width: story ? 380 : 320,
            height: story ? 380 : 320,
            borderRadius: "50%",
            padding: 10,
            background: `linear-gradient(135deg, ${TURQ}, ${TURQ}44 60%, transparent)`,
            boxShadow: `0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px ${TURQ}33`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt=""
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: `6px solid ${CREAM}`, boxSizing: "border-box", background: "#eef1f4" }}
          />
        </div>

        <div style={{ marginTop: story ? 56 : 40, fontFamily: "var(--font-display), Georgia, serif", fontSize: nameSize, fontWeight: 600, lineHeight: 1.08, maxWidth: 900 }}>
          {name}
        </div>
        <div style={{ marginTop: 18, fontSize: titleSize, fontWeight: 600, color: TURQ, maxWidth: 880, lineHeight: 1.15 }}>
          {title}
        </div>
        <div
          style={{
            marginTop: 26,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 30px",
            borderRadius: 999,
            background: "rgba(255,253,249,0.08)",
            border: "1px solid rgba(255,253,249,0.22)",
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <span style={{ color: TURQ, fontSize: 30 }}>◉</span> {district} · Çanakkale
        </div>

        {/* Uzmanlık çipleri veya kısa bio — glass panel */}
        {(chips.length > 0 || shortBio) && (
          <div
            style={{
              marginTop: story ? 60 : 40,
              maxWidth: 900,
              padding: chips.length ? "30px 36px" : "30px 44px",
              borderRadius: 28,
              background: "rgba(255,253,249,0.07)",
              border: "1px solid rgba(255,253,249,0.16)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            {chips.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
                {chips.map((c) => (
                  <span
                    key={c}
                    style={{
                      padding: "12px 26px",
                      borderRadius: 999,
                      background: `${TURQ}1d`,
                      border: `1px solid ${TURQ}55`,
                      color: CREAM,
                      fontSize: 28,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.length > 34 ? `${c.slice(0, 31)}…` : c}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 30, lineHeight: 1.5, color: "rgba(255,253,249,0.85)" }}>{shortBio}</div>
            )}
          </div>
        )}
      </div>

      {/* Alt: QR + çağrı + site — glass bar */}
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 36,
          padding: "34px 40px",
          borderRadius: 32,
          background: "rgba(255,253,249,0.08)",
          border: "1px solid rgba(255,253,249,0.18)",
          boxShadow: "0 24px 70px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ flexShrink: 0, padding: 14, borderRadius: 22, background: CREAM }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="" style={{ width: story ? 170 : 150, height: story ? 170 : 150, display: "block" }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 40, fontWeight: 700, display: "flex", alignItems: "center", gap: 14 }}>
            Profili İncele <span style={{ color: TURQ }}>→</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 30, color: TURQ, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {profileHost}
          </div>
          <div style={{ marginTop: 8, fontSize: 26, color: "rgba(255,253,249,0.65)" }}>
            canakkaleuzman.com · Çanakkale&apos;nin uzman dizini
          </div>
        </div>
      </div>
    </div>
  );
}
