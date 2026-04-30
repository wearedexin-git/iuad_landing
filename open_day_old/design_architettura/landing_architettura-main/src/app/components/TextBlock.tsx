import { CTAButton } from "./CTAButton";
import { InteriorIcon } from "./InteriorIcon";

export function TextBlock({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section className="relative bg-white py-20 md:py-32 px-5 md:px-10 lg:px-[calc(8.33%+35px)] overflow-hidden">
      <div className="max-w-[1130px] mx-auto">
        <div className="font-sarabun font-normal text-[32px] md:text-[48px] lg:text-[64px] text-black leading-[1.16] mb-10 md:mb-14">
          Entra nel luogo dove la tua visione incontra la tecnica. Un percorso condiviso per trasformare la passione in una professione solida.{" "}
          <InteriorIcon variant="small" className="inline-block align-middle w-[20px] h-[39px] md:w-[28px] md:h-[54px] lg:w-[36px] lg:h-[70px]" />
        </div>
        <CTAButton onClick={onBookClick} />
      </div>
    </section>
  );
}
