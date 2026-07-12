type IconProps = {
  className?: string;
};

export function LighthouseIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M18 42h12l-2-26h-8l-2 26Z" stroke="currentColor" strokeWidth="2" />
      <path d="M19 16h10l-2-7h-6l-2 7Z" stroke="currentColor" strokeWidth="2" />
      <path d="M16 42h16M22 23h4M21 30h6M20 37h8" stroke="currentColor" strokeWidth="2" />
      <path d="M12 13 4 10M36 13l8-3M16 7 10-4 10 4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function SearchIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CategoryIcon({ className = "", type }: IconProps & { type: string }) {
  const common = "currentColor";
  return (
    <svg viewBox="0 0 56 56" fill="none" className={className} aria-hidden="true">
      {type === "psikoloji" && (
        <>
          <path d="M24 10c-6 0-11 5-11 11 0 3 1 5 3 7-2 2-3 4-3 7 0 6 5 11 11 11h4V10h-4Z" stroke={common} strokeWidth="2" />
          <path d="M32 10c6 0 11 5 11 11 0 3-1 5-3 7 2 2 3 4 3 7 0 6-5 11-11 11h-4V10h4Z" stroke={common} strokeWidth="2" />
          <path d="M19 23h9M18 34h10M28 19h7M28 36h8" stroke={common} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {type === "saglik" && (
        <>
          <path d="M18 11v12a10 10 0 0 0 20 0V11" stroke={common} strokeWidth="2" />
          <path d="M18 11h-4M38 11h4M28 33v4a8 8 0 0 0 16 0v-5" stroke={common} strokeWidth="2" strokeLinecap="round" />
          <circle cx="44" cy="28" r="4" stroke={common} strokeWidth="2" />
        </>
      )}
      {type === "hukuk" && (
        <>
          <path d="M28 10v36M16 17h24M18 17l-8 15h16l-8-15ZM38 17l-8 15h16l-8-15Z" stroke={common} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 46h16" stroke={common} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {type === "egitim" && (
        <>
          <path d="M12 15h14a7 7 0 0 1 7 7v22H19a7 7 0 0 1-7-7V15Z" stroke={common} strokeWidth="2" />
          <path d="M44 15H33a7 7 0 0 0-7 7v22h11a7 7 0 0 0 7-7V15Z" stroke={common} strokeWidth="2" />
          <path d="M18 23h8M33 23h6M18 30h8M33 30h6" stroke={common} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {type === "beslenme" && (
        <>
          <path d="M26 20c-8 2-13 9-10 17 3 7 11 8 16 3 5 5 13 4 16-3 3-8-2-15-10-17-3-1-5 0-6 2-1-2-3-3-6-2Z" stroke={common} strokeWidth="2" />
          <path d="M32 22c0-8 5-12 12-12 0 7-4 12-12 12Z" stroke={common} strokeWidth="2" />
          <path d="M31 23c-2-5-5-8-10-10" stroke={common} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {type === "kisisel-gelisim" && (
        <>
          <path d="M28 44c-7-8-14-13-22-16 8-3 15-8 22-16 7 8 14 13 22 16-8 3-15 8-22 16Z" stroke={common} strokeWidth="2" />
          <path d="M28 14v28M11 28h34M18 20c4 4 7 9 10 22M38 20c-4 4-7 9-10 22" stroke={common} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function TrustIcon({ className = "", type }: IconProps & { type: "shield" | "pin" | "star" }) {
  return (
    <svg viewBox="0 0 42 42" fill="none" className={className} aria-hidden="true">
      {type === "shield" && <path d="M21 5 34 10v10c0 9-5 14-13 17C13 34 8 29 8 20V10l13-5Z" stroke="currentColor" strokeWidth="2" />}
      {type === "pin" && (
        <>
          <path d="M21 37s11-10 11-21A11 11 0 0 0 10 16c0 11 11 21 11 21Z" stroke="currentColor" strokeWidth="2" />
          <circle cx="21" cy="16" r="4" stroke="currentColor" strokeWidth="2" />
        </>
      )}
      {type === "star" && <path d="m21 5 4.5 10 11 1-8.3 7.2 2.5 10.8L21 28.4 11.3 34l2.5-10.8L5.5 16l11-1L21 5Z" stroke="currentColor" strokeWidth="2" />}
    </svg>
  );
}
