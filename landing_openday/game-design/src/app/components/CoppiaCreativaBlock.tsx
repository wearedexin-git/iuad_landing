import imgCourseImage from "../../assets/course_image.jpg";
import { CTAButton } from "./CTAButton";
import { EyeIcon } from "./EyeIcon";
import { LazyImage } from "./LazyImage";

export function CoppiaCreativaBlock({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section className="relative bg-[#fbf6c3] py-16 md:py-24 overflow-hidden">
      <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-16 px-5 md:px-10 justify-center xl:px-[calc(8.33%+35px)]">
        {/* Image */}
        <div className="relative w-full max-w-[362px] xl:w-[362px] shrink-0">
          <div className="rotate-[-4.54deg]">
            <div className="relative rounded-[12px] overflow-hidden border-2 border-[#b2ab38] aspect-[362/519]">
              <LazyImage
                alt="Studenti al lavoro"
                className="absolute inset-0 w-full h-full object-cover"
                src={imgCourseImage}
              />
            </div>
          </div>
          {/* SVG decorativa — in basso a sinistra sopra l'immagine, non ruotata */}
          <div className="absolute bottom-[-40px] md:bottom-[-100px] left-0 z-10">
            <EyeIcon variant="medium" className="w-[140px] h-[87px] md:w-[190px] md:h-[117px] xl:w-[237px] xl:h-[146px]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 md:gap-10 max-w-[670px]">
          <div className="flex flex-col gap-6">
            <h2 className="font-tiempos text-[36px] md:text-[48px] lg:text-[58px] text-[#b2ab38] leading-[1.1]">
              Il team di sviluppo
            </h2>
            <p className="font-sarabun font-light text-[20px] md:text-[24px] lg:text-[28px] text-[#201f1f] leading-[1.4]">
              <span className="font-bold">Game Designer, Programmatori e 3D Artist sono il motore di ogni studio di sviluppo. Insieme, trasformano un'idea astratta in un mondo interattivo tutto da esplorare.</span>Designer danno vita alle regole del gioco, alla storia e al coinvolgimento dell'utente, i modellatori e gli animatori costruiscono l'impatto visivo e l'atmosfera: una sinergia totale che nasce nei nostri laboratori per creare l'esperienza di gioco perfetta.
            </p>
          </div>
          <CTAButton onClick={onBookClick} className="self-start" />
        </div>
      </div>

    </section>
  );
}
