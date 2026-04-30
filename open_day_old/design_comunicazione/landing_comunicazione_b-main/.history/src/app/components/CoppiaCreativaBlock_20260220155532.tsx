import imgCourseImage from "../../assets/course_image.png";
import { CTAButton } from "./CTAButton";
import { EyeIcon } from "./EyeIcon";

export function CoppiaCreativaBlock({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section className="relative bg-[#f4dbcc] py-16 md:py-24 overflow-hidden">
      <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-16 px-5 md:px-10 xl:px-[calc(8.33%+35px)]">
        {/* Image */}
        <div className="relative w-full max-w-[362px] xl:w-[362px] shrink-0">
          <div className="rotate-[-4.54deg]">
            <div className="relative rounded-[12px] overflow-hidden border-2 border-[#d06321] aspect-[362/519]">
              <img
                alt="Studenti al lavoro"
                className="absolute inset-0 w-full h-full object-cover"
                src={imgCourseImage}
              />
            </div>
          </div>
          {/* SVG decorativa — in basso a sinistra sopra l'immagine, non ruotata */}
          <div className="absolute bottom-[-40px] left-0 z-10">
            <EyeIcon variant="medium" className="w-[140px] h-[87px] md:w-[190px] md:h-[117px] xl:w-[237px] xl:h-[146px]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 md:gap-10 max-w-[670px]">
          <div className="flex flex-col gap-6">
            <h2 className="font-tiempos text-[36px] md:text-[48px] lg:text-[58px] text-[#d06321] leading-[1.1]">
              La coppia creativa
            </h2>
            <p className="font-sarabun font-light text-[20px] md:text-[24px] lg:text-[28px] text-[#201f1f] leading-[1.4]">
              <span className="font-bold">
                Art Director e Copywriter sono il motore di ogni agenzia.{" "}
              </span>
              Insieme, trasformano l'identità di un brand in{" "}
              <span className="font-bold">idee</span>,{" "}
              <span className="font-bold">campagne social</span> e{" "}
              <span className="font-bold">spot pubblicitari</span>.
              <br />
              Mentre il Copy dà voce ai valori attraverso il linguaggio, l'Art
              costruisce l'impatto visivo: una sinergia che nasce dalla ricerca
              costante del punto di forza di ogni prodotto.
            </p>
          </div>
          <CTAButton onClick={onBookClick} className="self-start" />
        </div>
      </div>

    </section>
  );
}
