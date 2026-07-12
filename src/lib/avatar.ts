// Kişiye özel, deterministik avatar görseli (data URI SVG).
// Gerçek/AI portre değil; her uzmana farklı renkli temsili görsel verir.

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toLocaleUpperCase("tr");
}

// Kadın ilk isimleri (fotoğraf cinsiyeti seçimi için).
const FEMALE_NAMES = new Set([
  "Ayşe", "Fatma", "Elif", "Zeynep", "Merve", "Selin", "Deniz", "Ece", "Gizem",
  "Büşra", "Damla", "Nur", "Sıla", "İrem", "Melis", "Pınar", "Ceren", "Aslı",
  "Derya", "Esra", "Seda", "Gül", "Hatice", "Emine", "Sevgi", "Nazlı",
]);

// Uzmana gerçekçi insan portresi (randomuser.me). İsimden deterministik seçim;
// aynı uzman her zaman aynı fotoğrafı alır. Yüklenemezse avatarUri'ye düşülür.
export function expertPhoto(name: string): string {
  const first = name.trim().split(/\s+/)[0];
  const gender = FEMALE_NAMES.has(first) ? "women" : "men";
  const idx = hash(name) % 100;
  return `https://randomuser.me/api/portraits/${gender}/${idx}.jpg`;
}

// İsimden tutarlı bir avatar üretir (renk isme göre değişir).
export function avatarUri(name: string): string {
  const initials = initialsOf(name);
  const hue = hash(name) % 360;
  const c1 = `hsl(${hue} 42% 62%)`;
  const c2 = `hsl(${(hue + 28) % 360} 46% 46%)`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360">
<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
<rect width="360" height="360" fill="url(#g)"/>
<circle cx="180" cy="140" r="62" fill="rgba(255,255,255,0.85)"/>
<path d="M70 330c12-70 62-104 110-104s98 34 110 104" fill="rgba(255,255,255,0.85)"/>
<text x="180" y="205" text-anchor="middle" font-family="Georgia, serif" font-size="78" font-weight="600" fill="#0d2c4b">${initials}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
