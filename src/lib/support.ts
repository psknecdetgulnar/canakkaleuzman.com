import { sb as db } from "@/lib/supabaseClient";

// Kullanıcı ↔ admin destek hattı. Uzman/şirket panellerindeki "Destek"
// sayfasından gönderilir; admin /admin panelinden cevaplar, cevap aynı
// kaydın admin_reply alanına yazılır ve kullanıcı panelinde görünür.
// RLS: gönderme herkese açık; okuma yalnızca gönderenin sahibi veya admin.

export type SupportSenderType = "uzman" | "sirket" | "ziyaretci";

export type SupportMessage = {
  id: string;
  senderType: SupportSenderType;
  senderId: string | null;
  senderName: string;
  senderEmail: string | null;
  subject: string;
  message: string;
  adminReply: string | null;
  status: "open" | "answered" | "closed";
  createdAt: string;
  repliedAt: string | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function rowToSupportMessage(r: any): SupportMessage {
  return {
    id: r.id,
    senderType: r.sender_type,
    senderId: r.sender_id ?? null,
    senderName: r.sender_name,
    senderEmail: r.sender_email ?? null,
    subject: r.subject,
    message: r.message,
    adminReply: r.admin_reply ?? null,
    status: r.status,
    createdAt: r.created_at,
    repliedAt: r.replied_at ?? null,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export type NewSupportMessage = {
  senderType: SupportSenderType;
  senderId?: string;
  senderName: string;
  senderEmail?: string;
  subject: string;
  message: string;
};

export async function createSupportMessage(m: NewSupportMessage): Promise<{ ok: boolean; error?: string }> {
  if (!db) return { ok: false, error: "Bağlantı yok" };
  const { error } = await db.from("support_messages").insert({
    sender_type: m.senderType,
    sender_id: m.senderId ?? null,
    sender_name: m.senderName.trim().slice(0, 120),
    sender_email: m.senderEmail?.trim().slice(0, 160) || null,
    subject: m.subject.trim().slice(0, 200),
    message: m.message.trim().slice(0, 2000),
  });
  return error ? { ok: false, error: error.message } : { ok: true };
}

// Panel: gönderenin kendi mesajları (en yeni önce).
export async function getSupportMessagesBySender(
  senderType: SupportSenderType,
  senderId: string
): Promise<SupportMessage[]> {
  if (!db) return [];
  const { data, error } = await db
    .from("support_messages")
    .select("*")
    .eq("sender_type", senderType)
    .eq("sender_id", senderId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToSupportMessage);
}
