import imgCourseImage from "../../assets/course_image.jpg";
import { CTAButton } from "./CTAButton";
import { FashionIcon } from "./FashionIcon";
import { LazyImage } from "./LazyImage";

export function CoppiaCreativaBlock({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section className="relative bg-[#D6E2F0] py-16 md:py-24 overflow-hidden">
      <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-16 px-5 md:px-10 justify-center xl:px-[calc(8.33%+35px)]">
        {/* Image */}
        <div className="relative w-full max-w-[362px] xl:w-[362px] shrink-0">
          <div className="rotate-[-4.54deg]">
            <div className="relative rounded-[12px] overflow-hidden border-2 border-[#8D9EBD] aspect-[362/519]">
              <LazyImage
                alt="Studenti al lavoro"
                className="absolute inset-0 w-full h-full object-cover"
                src={imgCourseImage}
              />
            </div>
          </div>
          {/* Icona moda — angolo in basso a sinistra del blocco immagine, non ruotata con la card */}
          <div className="absolute bottom-[-40px] left-0 z-10 flex justify-start">
            <FashionIcon
              className="w-[140px] h-[87px] md:w-[190px] md:h-[117px] xl:w-[237px] xl:h-[146px]"
              imgClassName="object-left object-bottom"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 md:gap-10 max-w-[670px]">
          <div className="flex flex-col gap-6">
            <h2 className="font-tiempos text-[36px] md:text-[48px] lg:text-[58px] text-[#8D9EBD] leading-[1.1]">
              Il punto d&apos;incontro tra creatività e strategia.
            </h2>
            <p className="font-sarabun font-light text-[20px] md:text-[24px] lg:text-[28px] text-[#201f1f] leading-[1.4]">
              L&apos;indirizzo in <span className="font-bold">Business &amp; Management</span> nasce per formare il{" "}
              <span className="font-bold">Designer Manager</span>: una figura chiave che unisce il talento creativo alle attuali esigenze di mercato. È la scelta ideale se, oltre a muoverti tra tessuti e collezioni, desideri sviluppare{" "}
              <span className="font-bold">piani strategici e obiettivi aziendali</span> con capacità e fluidità.
            </p>
          </div>
          <CTAButton onClick={onBookClick} className="self-start" />
        </div>
      </div>

    </section>
  );
}
