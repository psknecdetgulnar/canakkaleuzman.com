import { createClient } from "@supabase/supabase-js";

// Şirket tanıtım profilleri + iş ilanları → Supabase.
// RLS: anon insert/update demo modda açık (Faz-auth'ta sahibe kilitlenecek).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key && !url.includes("xxxx") ? createClient(url, key, { auth: { persistSession: false } }) : null;

export type Company = {
  id: string;
  name: string;
  sector: string;
  city: string;
  description: string | null;
  logoInitials: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  status: "pending" | "approved" | "rejected";
  premium: boolean;
  createdAt: string;
};

export type EmploymentType = "Tam zamanlı" | "Yarı zamanlı" | "Stajyer" | "Uzaktan";

export type JobListing = {
  id: string;
  companyId: string;
  title: string;
  description: string;
  employmentType: string;
  location: string;
  contactEmail: string | null;
  contactPhone: string | null;
  status: "open" | "closed";
  createdAt: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToCompany(r: any): Company {
  return {
    id: r.id,
    name: r.name,
    sector: r.sector,
    city: r.city,
    description: r.description ?? null,
    logoInitials: r.logo_initials,
    website: r.website ?? null,
    phone: r.phone ?? null,
    email: r.email ?? null,
    address: r.address ?? null,
    status: r.status,
    premium: r.premium ?? false,
    createdAt: r.created_at,
  };
}

function rowToJob(r: any): JobListing {
  return {
    id: r.id,
    companyId: r.company_id,
    title: r.title,
    description: r.description,
    employmentType: r.employment_type,
    location: r.location,
    contactEmail: r.contact_email ?? null,
    contactPhone: r.contact_phone ?? null,
    status: r.status,
    createdAt: r.created_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getCompanies(): Promise<Company[]> {
  if (!db) return [];
  const { data, error } = await db.from("companies").select("*").eq("status", "approved").order("name");
  if (error || !data) return [];
  return data.map(rowToCompany);
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  if (!db) return null;
  const { data, error } = await db.from("companies").select("*").eq("id", slug).maybeSingle();
  if (error || !data) return null;
  return rowToCompany(data);
}

export type NewCompany = {
  name: string;
  sector: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export async function createCompany(c: NewCompany): Promise<{ ok: boolean; error?: string; id?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const base = slugify(c.name).slice(0, 60) || "sirket";
  let id = base;
  for (let i = 1; i < 50; i++) {
    const { data: existing } = await db.from("companies").select("id").eq("id", id).maybeSingle();
    if (!existing) break;
    id = `${base}-${i + 1}`;
  }
  const initials = c.name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const { error } = await db.from("companies").insert({
    id,
    name: c.name.trim().slice(0, 160),
    sector: c.sector,
    description: c.description?.trim().slice(0, 1000) || null,
    logo_initials: initials || "??",
    website: c.website?.trim() || null,
    phone: c.phone?.trim() || null,
    email: c.email?.trim() || null,
    address: c.address?.trim() || null,
    status: "approved",
  });
  return error ? { ok: false, error: error.message } : { ok: true, id };
}

export async function updateCompany(
  id: string,
  patch: Partial<Omit<NewCompany, "name">>
): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const payload: Record<string, unknown> = {};
  if (patch.sector !== undefined) payload.sector = patch.sector;
  if (patch.description !== undefined) payload.description = patch.description.trim().slice(0, 1000) || null;
  if (patch.website !== undefined) payload.website = patch.website.trim() || null;
  if (patch.phone !== undefined) payload.phone = patch.phone.trim() || null;
  if (patch.email !== undefined) payload.email = patch.email.trim() || null;
  if (patch.address !== undefined) payload.address = patch.address.trim() || null;
  const { error } = await db.from("companies").update(payload).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function getJobListings(): Promise<JobListing[]> {
  if (!db) return [];
  const { data, error } = await db.from("job_listings").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToJob);
}

export async function getOpenJobListings(): Promise<JobListing[]> {
  const all = await getJobListings();
  return all.filter((j) => j.status === "open");
}

export async function getJobListingsByCompany(companyId: string): Promise<JobListing[]> {
  if (!db) return [];
  const { data, error } = await db
    .from("job_listings")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToJob);
}

export type NewJobListing = {
  companyId: string;
  title: string;
  description: string;
  employmentType: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
};

export async function createJobListing(j: NewJobListing): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const { error } = await db.from("job_listings").insert({
    company_id: j.companyId,
    title: j.title.trim().slice(0, 160),
    description: j.description.trim().slice(0, 2000),
    employment_type: j.employmentType,
    location: j.location?.trim() || "Çanakkale",
    contact_email: j.contactEmail?.trim() || null,
    contact_phone: j.contactPhone?.trim() || null,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function updateJobListingStatus(
  id: string,
  status: "open" | "closed"
): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const { error } = await db.from("job_listings").update({ status }).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function deleteJobListing(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const { error } = await db.from("job_listings").delete().eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}
