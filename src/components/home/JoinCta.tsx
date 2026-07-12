"use client";

type JoinCtaProps = {
  onJoinClick: () => void;
};

export function JoinCta({ onJoinClick }: JoinCtaProps) {
  return (
    // 2- Tek parça lacivert band (#1a3652)
    <section className="relative overflow-hidden bg-[#1a3652] px-5 py-10 text-[#fffdf9]">
      {/* 5- Sol köşe: Truva Atı (saydam, band ile aynı lacivert) */}
      <img
        src="/images/cta-horse-v3.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 hidden h-[74%] w-auto object-contain object-left-bottom md:block"
      />
      {/* 6- Sağ köşe: Çanakkale Köprüsü (saydam, band ile aynı lacivert) */}
      <img
        src="/images/cta-bridge-v3.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 hidden h-[74%] w-auto object-contain object-right-bottom md:block"
      />

      {/* 3-4- Ortada yazı + yanında altın sarısı buton */}
      <div className="relative mx-auto flex max-w-[600px] flex-col items-center gap-5 text-center md:flex-row md:items-center md:justify-center md:gap-7 md:text-left">
        <div>
          <h2 className="font-display text-[2.1rem] font-semibold leading-tight md:text-[2.4rem]">
            Uzman olarak aramıza katılın!
          </h2>
          <p className="mt-2 text-sm text-[#e8d8c2] md:text-base">
            Profilinizi oluşturun, daha fazla kişiye ulaşın.
          </p>
        </div>
        <button
          type="button"
          onClick={onJoinClick}
          className="shrink-0 whitespace-nowrap rounded-[6px] bg-[#c99a53] px-6 py-3 text-sm font-semibold text-[#fffdf9] transition-colors hover:bg-[#b98742]"
        >
          Uzman Kaydı Oluştur →
        </button>
      </div>
    </section>
  );
}
