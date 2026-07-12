"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePanelProfile } from "@/components/panel/PanelProfileContext";
import { ProfileSwitcher } from "@/components/panel/ProfileSwitcher";
import {
  getBlogPostsByAuthor,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/db";
import type { BlogPost } from "@/data/blog";

const CATEGORIES = ["Psikoloji", "Beslenme", "Hukuk", "Sağlık", "Eğitim", "Diğer"];

// Uzmanların kendi bloglarına görselsiz, sade metin yazı ekleyebildiği panel
// ekranı (spesifikasyon §2: "Blog — görselsiz, sadece metin yazı ekleme").
export default function PanelBlogPage() {
  const { experts, activeSlug, loading: profileLoading } = usePanelProfile();
  const active = experts.find((e) => e.id === activeSlug);
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: CATEGORIES[0], excerpt: "", bodyText: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeSlug) return;
    let alive = true;
    setPosts(null);
    getBlogPostsByAuthor(activeSlug).then((rows) => {
      if (alive) setPosts(rows);
    });
    return () => {
      alive = false;
    };
  }, [activeSlug]);

  function startNew() {
    setEditingSlug("__new__");
    setForm({ title: "", category: CATEGORIES[0], excerpt: "", bodyText: "" });
    setError(null);
  }

  function startEdit(p: BlogPost) {
    setEditingSlug(p.slug);
    setForm({ title: p.title, category: p.category, excerpt: p.excerpt, bodyText: p.body.join("\n\n") });
    setError(null);
  }

  async function submit(publish: boolean) {
    if (!active) return;
    if (!form.title.trim() || !form.excerpt.trim() || !form.bodyText.trim()) {
      setError("Başlık, özet ve içerik zorunludur.");
      return;
    }
    setBusy(true);
    setError(null);
    const body = form.bodyText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    if (editingSlug === "__new__") {
      const res = await createBlogPost({
        title: form.title,
        authorId: active.id,
        authorName: active.name,
        authorTitle: active.title,
        category: form.category,
        excerpt: form.excerpt,
        body,
        published: publish,
      });
      if (res.ok) {
        const rows = await getBlogPostsByAuthor(active.id);
        setPosts(rows);
        setEditingSlug(null);
      } else {
        setError(res.error ?? "Kaydedilemedi.");
      }
    } else if (editingSlug) {
      const res = await updateBlogPost(editingSlug, {
        title: form.title,
        category: form.category,
        excerpt: form.excerpt,
        body,
        published: publish,
      });
      if (res.ok) {
        const rows = await getBlogPostsByAuthor(active.id);
        setPosts(rows);
        setEditingSlug(null);
      } else {
        setError(res.error ?? "Kaydedilemedi.");
      }
    }
    setBusy(false);
  }

  async function togglePublish(p: BlogPost) {
    setBusy(true);
    const res = await updateBlogPost(p.slug, { published: !p.published });
    if (res.ok && activeSlug) setPosts(await getBlogPostsByAuthor(activeSlug));
    setBusy(false);
  }

  async function remove(slug: string) {
    if (!confirm("Bu yazıyı silmek istediğine emin misin?")) return;
    setBusy(true);
    const res = await deleteBlogPost(slug);
    if (res.ok && activeSlug) setPosts(await getBlogPostsByAuthor(activeSlug));
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-[2rem] font-semibold text-[#0d2c4b]">Blog</h1>
        <p className="mt-1 max-w-[65ch] text-sm text-[#102844]">
          Görselsiz, sade metin yazılar ekleyebilirsin. Taslak olarak kaydedebilir veya doğrudan
          yayınlayabilirsin — yayınlanan yazılar herkese açık blog listesinde ve profilinde görünür.
        </p>
      </div>

      <ProfileSwitcher />

      {!editingSlug && (
        <button
          type="button"
          onClick={startNew}
          className="self-start rounded-[8px] bg-[#0d2c4b] px-5 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60]"
        >
          + Yeni yazı
        </button>
      )}

      {editingSlug && (
        <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(13,44,75,0.05)]">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">Başlık</span>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                maxLength={160}
                className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">Kategori</span>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="h-11 rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] px-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">Kısa özet (liste sayfalarında görünür)</span>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={2}
                maxLength={300}
                className="rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] p-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[rgba(16,40,68,0.6)]">
                İçerik — paragrafları boş satırla ayır (görsel eklenemez)
              </span>
              <textarea
                value={form.bodyText}
                onChange={(e) => setForm((f) => ({ ...f, bodyText: e.target.value }))}
                rows={10}
                className="rounded-[6px] border border-[rgba(16,40,68,0.14)] bg-[#fffdf9] p-3 text-sm text-[#0d2c4b] outline-none focus:border-[#c99a53]"
              />
            </label>

            {error && <p className="text-sm text-[#b3261e]">{error}</p>}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => submit(true)}
                className="rounded-[6px] bg-[#0d2c4b] px-4 py-2 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#143a60] disabled:opacity-50"
              >
                Yayınla
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => submit(false)}
                className="rounded-[6px] border border-[rgba(16,40,68,0.2)] px-4 py-2 text-sm font-semibold text-[#102844] transition-colors hover:border-[#c99a53] disabled:opacity-50"
              >
                Taslak olarak kaydet
              </button>
              <button
                type="button"
                onClick={() => setEditingSlug(null)}
                className="rounded-[6px] px-4 py-2 text-sm font-semibold text-[rgba(16,40,68,0.6)] hover:text-[#0d2c4b]"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {profileLoading || posts === null ? (
        <div className="h-32 animate-pulse rounded-[14px] bg-[#f3eee6]" />
      ) : posts.length === 0 ? (
        <div className="rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#f3eee6] px-5 py-10 text-center text-[#102844]">
          Henüz yazın yok. &ldquo;+ Yeni yazı&rdquo; ile ilk blog yazını ekle.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((p) => (
            <div
              key={p.slug}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[rgba(16,40,68,0.10)] bg-[#fffdf9] p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0d2c4b]">{p.title}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.published ? "bg-[#0d2c4b] text-[#fffdf9]" : "border border-[rgba(16,40,68,0.2)] text-[rgba(16,40,68,0.6)]"
                    }`}
                  >
                    {p.published ? "Yayında" : "Taslak"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[rgba(16,40,68,0.6)]">{p.category} · {p.date}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.published && (
                  <Link href={`/blog/${p.slug}`} target="_blank" className="rounded-[6px] border border-[rgba(16,40,68,0.2)] px-3 py-1.5 text-xs font-semibold text-[#102844] hover:border-[#c99a53]">
                    Görüntüle
                  </Link>
                )}
                <button type="button" disabled={busy} onClick={() => startEdit(p)} className="rounded-[6px] border border-[rgba(16,40,68,0.2)] px-3 py-1.5 text-xs font-semibold text-[#102844] hover:border-[#c99a53] disabled:opacity-50">
                  Düzenle
                </button>
                <button type="button" disabled={busy} onClick={() => togglePublish(p)} className="rounded-[6px] border border-[rgba(16,40,68,0.2)] px-3 py-1.5 text-xs font-semibold text-[#102844] hover:border-[#c99a53] disabled:opacity-50">
                  {p.published ? "Yayından kaldır" : "Yayınla"}
                </button>
                <button type="button" disabled={busy} onClick={() => remove(p.slug)} className="rounded-[6px] border border-[rgba(179,38,30,0.3)] px-3 py-1.5 text-xs font-semibold text-[#b3261e] hover:bg-[rgba(179,38,30,0.06)] disabled:opacity-50">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
