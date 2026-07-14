import { sb as db } from "@/lib/supabaseClient";

// Halka açık ilan gönderimi: iş ilanı (işveren) + iş arayan.
// Gönderim herkese açık ama 'pending' düşer; admin onayıyla yayınlanır.

export type ListingKind = "is_ilani" | "is_arayan";

export type PublicListing = {
  id: string;
  kind: ListingKind;
  status: "pending" | "approved" | "rejected";
  title: string;
  description: string;
  location: string;
  employmentType: string | null;
  salary: string | null;
  contactName: string;
  contactPhone: string | null;
  contactEmail: string | null;
  contactWhatsapp: string | null;
  orgName: string | null;
  requirements: string | null;
  experience: string | null;
  education: string | null;
  availability: string | null;
  rejectionReason: string | null;
  deletedAt: string | null;
  createdAt: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function rowToListing(r: any): PublicListing {
  return {
    id: r.id, kind: r.kind, status: r.status, title: r.title, description: r.description,
    location: r.location, employmentType: r.employment_type ?? null, salary: r.salary ?? null,
    contactName: r.contact_name, contactPhone: r.contact_phone ?? null,
    contactEmail: r.contact_email ?? null, contactWhatsapp: r.contact_whatsapp ?? null,
    orgName: r.org_name ?? null, requirements: r.requirements ?? null,
    experience: r.experience ?? null, education: r.education ?? null,
    availability: r.availability ?? null, rejectionReason: r.rejection_reason ?? null,
    deletedAt: r.deleted_at ?? null, createdAt: r.created_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export type NewListing = {
  kind: ListingKind;
  title: string;
  description: string;
  location?: string;
  employmentType?: string;
  salary?: string;
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
  orgName?: string;
  requirements?: string;
  experience?: string;
  education?: string;
  availability?: string;
};

export async function submitListing(l: NewListing): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  if (!l.contactPhone?.trim() && !l.contactEmail?.trim()) {
    return { ok: false, error: "En az bir iletişim kanalı (telefon veya e-posta) zorunludur." };
  }
  const s = (v?: string, n = 300) => v?.trim().slice(0, n) || null;
  const { error } = await db.from("public_listings").insert({
    kind: l.kind,
    title: l.title.trim().slice(0, 160),
    description: l.description.trim().slice(0, 3000),
    location: s(l.location, 120) ?? "Çanakkale",
    employment_type: s(l.employmentType, 40),
    salary: s(l.salary, 120),
    contact_name: l.contactName.trim().slice(0, 120),
    contact_phone: s(l.contactPhone, 40),
    contact_email: s(l.contactEmail, 160),
    contact_whatsapp: s(l.contactWhatsapp, 40),
    org_name: s(l.orgName, 160),
    requirements: s(l.requirements, 1500),
    experience: s(l.experience, 1500),
    education: s(l.education, 300),
    availability: s(l.availability, 120),
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

// Halka açık: onaylanmış ilanlar (RLS zaten filtreler; belirtiklik için tekrar).
export async function getApprovedListings(kind?: ListingKind): Promise<PublicListing[]> {
  if (!db) return [];
  let q = db.from("public_listings").select("*").eq("status", "approved").is("deleted_at", null).order("created_at", { ascending: false }).limit(100);
  if (kind) q = q.eq("kind", kind);
  const { data } = await q;
  return (data ?? []).map(rowToListing);
}
