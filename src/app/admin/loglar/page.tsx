"use client";

import { useEffect, useState } from "react";
import { getAuditLogs, type AuditLog } from "@/lib/adminPanel";
import { AdminCard, Badge, Empty, PageTitle } from "@/components/admin/ui";

// Audit log görüntüleyici. Kayıtlar RLS gereği güncellenemez/silinemez.
export default function LoglarPage() {
  const [rows, setRows] = useState<AuditLog[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    getAuditLogs(300).then(setRows);
  }, []);

  return (
    <div>
      <PageTitle title="İşlem Kayıtları (Audit Log)" desc="Hangi yönetici, ne zaman, hangi kaydı nasıl değiştirdi. Bu kayıtlar hiçbir rol tarafından silinemez veya değiştirilemez." />
      {rows === null ? (
        <div className="h-40 animate-pulse rounded-[14px] bg-[#e8e2d6]" />
      ) : rows.length === 0 ? (
        <Empty text="Henüz işlem kaydı yok." />
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((l) => (
            <AdminCard key={l.id} className="!p-3">
              <button type="button" className="flex w-full flex-wrap items-center justify-between gap-2 text-left" onClick={() => setOpen(open === l.id ? null : l.id)}>
                <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-[#0d2c4b]">{l.action}</span>
                  {l.targetId && <span className="text-[rgba(16,40,68,0.6)]">→ {l.targetType}:{l.targetId}</span>}
                  <Badge text={l.result} tone={l.result === "success" ? "green" : "red"} />
                </div>
                <div className="text-xs text-[rgba(16,40,68,0.55)]">
                  {l.adminEmail} ({l.adminRole ?? "?"}) · {new Date(l.createdAt).toLocaleString("tr-TR")}
                </div>
              </button>
              {open === l.id && (
                <div className="mt-2 grid gap-2 border-t border-[rgba(16,40,68,0.08)] pt-2 text-xs sm:grid-cols-2">
                  <div><span className="font-semibold text-[rgba(16,40,68,0.6)]">Önceki veri</span>
                    <pre className="mt-1 overflow-x-auto rounded-[6px] bg-[#f3eee6] p-2">{JSON.stringify(l.oldData ?? null, null, 1)}</pre>
                  </div>
                  <div><span className="font-semibold text-[rgba(16,40,68,0.6)]">Yeni veri</span>
                    <pre className="mt-1 overflow-x-auto rounded-[6px] bg-[#f3eee6] p-2">{JSON.stringify(l.newData ?? null, null, 1)}</pre>
                  </div>
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
