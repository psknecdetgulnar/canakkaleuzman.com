"use client";

import { useEffect, type ReactNode } from "react";

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ title, children, onClose }: ModalProps) {
  // Esc ile kapat + arka plan kaymasını engelle (erişilebilirlik/UX).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(13,44,75,0.58)] px-5 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Pencereyi kapat"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[520px] rounded-[18px] bg-[#fffdf9] p-6 text-[#102844] shadow-[0_22px_70px_rgba(13,44,75,0.22)]">
        <div className="flex items-start justify-between gap-5">
          <h2 id="modal-title" className="font-display text-[1.75rem] leading-tight">
            {title}
          </h2>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(16,40,68,0.16)] text-sm"
            onClick={onClose}
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
