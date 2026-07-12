"use client";

import { useState } from "react";
import { avatarUri, expertPhoto } from "@/lib/avatar";

// Gerçekçi insan portresi; yüklenemezse (offline vs.) kişiye özel avatara düşer.
export function ExpertPhoto({
  name,
  title,
  className,
}: {
  name: string;
  title?: string;
  className?: string;
}) {
  const [src, setSrc] = useState(() => expertPhoto(name));
  return (
    <img
      src={src}
      alt={`${name}${title ? ` — Çanakkale ${title}` : ""}`}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setSrc(avatarUri(name))}
    />
  );
}
