import { CTAButton } from "./CTAButton";

export function AgevolazioniBlock({ onBookClick }: { onBookClick: () => void }) {
  const base = import.meta.env.BASE_URL;
  const bandoHref = `${base}assets/IUAD_Bando-TOP-10-2026.pdf`;

  return (
    <section className="bg-[#f4dbcc] py-16 md:py-24">
      <div className="px-5 md:px-10 lg:px-[calc(8.33%+35px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Colonna testo */}
          <div className="flex flex-col gap-6 lg:gap-7 max-w-[560px]">
            <h2 className="font-tiempos text-[42px] md:text-[56px] lg:text-[64px] text-[#d06321] leading-[1.03]">
              IUAD supporta
              <br />
              il tuo talento
            </h2>
            <p className="font-sarabun font-light text-[18px] md:text-[20px] text-[#201f1f] leading-[1.5]">
              Per il Biennio in Art Direction &amp; Copywriting, mettiamo a disposizione
              diverse opportunità di sostegno per premiare il merito e facilitare il tuo
              percorso accademico.
            </p>

            <div className="pt-2">
              <a href="#form-section" onClick={onBookClick} aria-label="Vai al form di prenotazione">
                <CTAButton text="Prenota ora" />
              </a>
            </div>
          </div>

          {/* Colonna cards */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="md:col-span-2 rounded-[18px] md:rounded-[24px] bg-white p-6 md:p-8">
                <h3 className="font-tiempos text-[22px] md:text-[26px] text-[#d06321] leading-[1.1]">
                  Top 10
                </h3>
                <p className="mt-2 font-sarabun font-light text-[14px] md:text-[15px] text-[#201f1f] leading-[1.5] max-w-[520px]">
                  10 borse di studio al merito per i migliori creativi.
                </p>
                <div className="mt-4">
                  <a
                    href={bandoHref}
                    download
                    className="inline-flex items-center justify-center bg-[#d06321] px-5 py-2.5 rounded-full transition-opacity hover:opacity-90 active:scale-[0.98]"
                    aria-label="Scarica il bando in PDF"
                  >
                    <span className="font-tiempos text-[16px] text-white leading-none whitespace-nowrap">
                      Scarica bando
                    </span>
                  </a>
                </div>
              </div>

              <div className="rounded-[18px] md:rounded-[24px] bg-white p-6 md:p-8">
                <h3 className="font-tiempos text-[22px] md:text-[26px] text-[#d06321] leading-[1.1]">
                  Borse ADISURC
                </h3>
                <p className="mt-2 font-sarabun font-light text-[14px] md:text-[15px] text-[#201f1f] leading-[1.5]">
                  Partecipa alle assegnazioni regionali per il diritto allo studio.
                </p>
              </div>

              <div className="rounded-[18px] md:rounded-[24px] bg-white p-6 md:p-8">
                <h3 className="font-tiempos text-[22px] md:text-[26px] text-[#d06321] leading-[1.1]">
                  Habacus Fondo Studio
                </h3>
                <p className="mt-2 font-sarabun font-light text-[14px] md:text-[15px] text-[#201f1f] leading-[1.5]">
                  Finanziamento con garanzia dello Stato, senza busta paga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

