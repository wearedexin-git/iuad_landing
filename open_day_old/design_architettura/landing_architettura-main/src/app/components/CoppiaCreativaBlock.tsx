import imgCourseImage from "../../assets/course_image.jpg";
import { CTAButton } from "./CTAButton";
import { InteriorIcon } from "./InteriorIcon";

export function CoppiaCreativaBlock({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section className="relative bg-[#D2E8DB] py-16 md:py-24 overflow-hidden">
      <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-16 px-5 md:px-10 justify-center xl:px-[calc(8.33%+35px)]">
        {/* Image */}
        <div className="relative w-full max-w-[362px] xl:w-[362px] shrink-0">
          <div className="rotate-[-4.54deg]">
            <div className="relative rounded-[12px] overflow-hidden border-2 border-[#719E85] aspect-[362/519]">
              <img
                alt="Studenti al lavoro"
                className="absolute inset-0 w-full h-full object-cover"
                src={imgCourseImage}
              />
            </div>
          </div>
          {/* SVG decorativa — in basso a sinistra sopra l'immagine, non ruotata */}
          <div className="absolute bottom-[-80px] md:bottom-[-100px] xl:bottom-[-120px] left-0 z-10">
            <InteriorIcon variant="medium" className="w-[73px] h-[140px] md:w-[98px] md:h-[190px] xl:w-[122px] xl:h-[237px]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 md:gap-10 max-w-[670px]">
          <div className="flex flex-col gap-6">
            <h2 className="font-tiempos text-[36px] md:text-[48px] lg:text-[58px] text-[#719E85] leading-[1.1]">
              Il punto d'incontro tra funzione ed estetica.
            </h2>
            <p className="font-sarabun font-light text-[20px] md:text-[24px] lg:text-[28px] text-[#201f1f] leading-[1.4]">
              Il corso Triennale in Design e Architettura degli Interni è la scelta giusta se desideri progettare spazi privati o commerciali. Partendo dalle basi del disegno architettonico, imparerai a unire l'estetica alla funzionalità: saprai{" "}
              <span className="font-bold">leggere i bisogni dei clienti e della comunità</span> per realizzare{" "}
              <span className="font-bold">progetti e oggetti di design</span> capaci di{" "}
              <span className="font-bold">migliorare la vita quotidiana</span>.
            </p>
          </div>
          <CTAButton onClick={onBookClick} className="self-start" />
        </div>
      </div>

    </section>
  );
}
