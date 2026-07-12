import { createClient } from "@supabase/supabase-js";

// Ziyaretçi randevu talebi + uzman gelen kutusu → Supabase.
// RLS: anon insert (ziyaretçi), demo okuma/güncelleme (auth Faz'ında sahibe kilitlenecek).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key && !url.includes("xxxx") ? createClient(url, key, { auth: { persistSession: false } }) : null;

export type AppointmentStatus = "pending" | "confirmed" | "rejected" | "cancelled";

export type Appointment = {
  id: string;
  expertId: string;
  visitorName: string;
  visitorPhone: string;
  note: string | null;
  day: string | null;
  time: string | null;
  status: AppointmentStatus;
  createdAt: string;
};

export type NewAppointment = {
  expertId: string;
  visitorName: string;
  visitorPhone: string;
  note?: string;
  day?: string;
  time?: string;
};

export async function createAppointment(a: NewAppointment): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const { error } = await db.from("appointments").insert({
    expert_id: a.expertId,
    visitor_name: a.visitorName.trim().slice(0, 120),
    visitor_phone: a.visitorPhone.trim().slice(0, 40),
    note: a.note?.trim().slice(0, 500) || null,
    day: a.day ?? null,
    slot_time: a.time ?? null,
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToAppointment(r: any): Appointment {
  return {
    id: r.id,
    expertId: r.expert_id,
    visitorName: r.visitor_name,
    visitorPhone: r.visitor_phone,
    note: r.note,
    day: r.day,
    time: r.slot_time,
    status: r.status,
    createdAt: r.created_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Panel gelen kutusu: bir uzmanın tüm randevu taleplerini getirir (en yeni önce).
export async function getAppointments(expertId: string): Promise<Appointment[]> {
  if (!db) return [];
  const { data, error } = await db
    .from("appointments")
    .select("*")
    .eq("expert_id", expertId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToAppointment);
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const { error } = await db.from("appointments").update({ status }).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}
