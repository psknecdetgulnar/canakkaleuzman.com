import { sb } from "@/lib/supabaseClient";
import type { ExpertProfile, ProfileSectionKey } from "@/data/experts";

// Panel düzenlemeleri Supabase'te (profile_overrides). RLS: okuma herkese
// açık (public profil bunları gösterir); yazma yalnızca profil sahibi/admin.
export type CalendarSlot = { day: string; time: string };
export type ProfileCalendar = { enabled: boolean; slots: CalendarSlot[] };

export type ProfileOverride = {
  fields: Partial<
    Pick<
      ExpertProfile,
      "name" | "title" | "firm" | "district" | "phone" | "whatsapp" | "email" | "website" | "longBio" | "expertiseAreas"
    >
  >;
  visibility: Partial<Record<ProfileSectionKey, boolean>>;
  sectionLabels?: Partial<Record<ProfileSectionKey, string>>;
  calendar?: ProfileCalendar;
};

const db = sb;

export async function loadProfileOverride(slug: string): Promise<ProfileOverride | null> {
  if (!db) return null;
  const { data } = await db.from("profile_overrides").select("*").eq("expert_id", slug).maybeSingle();
  if (!data) return null;
  return {
    fields: data.fields ?? {},
    visibility: data.visibility ?? {},
    sectionLabels: data.section_labels ?? {},
    calendar: data.calendar ?? { enabled: false, slots: [] },
  };
}

export async function saveProfileOverride(slug: string, o: ProfileOverride): Promise<void> {
  if (!db) return;
  await db.from("profile_overrides").upsert(
    {
      expert_id: slug,
      fields: o.fields,
      visibility: o.visibility,
      section_labels: o.sectionLabels ?? {},
      calendar: o.calendar ?? { enabled: false, slots: [] },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "expert_id" }
  );
}

export async function clearProfileOverride(slug: string): Promise<void> {
  if (!db) return;
  await db.from("profile_overrides").delete().eq("expert_id", slug);
}
