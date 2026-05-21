import imgCourseImage from "../../assets/course_image.jpg";
import { CTAButton } from "./CTAButton";
import { RegiaIcon } from "./RegiaIcon";
import { LazyImage } from "./LazyImage";

export function CoppiaCreativaBlock({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section className="relative bg-[#fbdee6] py-16 md:py-24 overflow-hidden">
      <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-16 px-5 md:px-10 justify-center xl:px-[calc(8.33%+35px)]">
        {/* Image */}
        <div className="relative w-full max-w-[362px] xl:w-[362px] shrink-0">
          <div className="rotate-[-4.54deg]">
            <div className="relative rounded-[12px] overflow-hidden border-2 border-[#801718] aspect-[362/519]">
              <LazyImage
                alt="Studenti al lavoro"
                className="absolute inset-0 w-full h-full object-cover"
                src={imgCourseImage}
              />
            </div>
          </div>
          {/* SVG decorativa — in basso a sinistra sopra l'immagine, non ruotata */}
          <div className="absolute bottom-[-40px] left-0 z-10">
            <RegiaIcon className="w-[87px] h-[87px] md:w-[117px] md:h-[117px] xl:w-[146px] xl:h-[146px]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 md:gap-10 max-w-[670px]">
          <div className="flex flex-col gap-6">
            <h2 className="font-tiempos text-[36px] md:text-[48px] lg:text-[58px] text-[#801718] leading-[1.1]">
              La sinergia sul set
            </h2>
            <p className="font-sarabun font-light text-[20px] md:text-[24px] lg:text-[28px] text-[#201f1f] leading-[1.4]">
              <span className="font-bold">Visione, tecnica e coordinamento sono il motore di ogni produzione. Il regista è la figura centrale che trasforma un'idea scritta in un'esperienza visiva memorabile.</span> Mentre la sceneggiatura dà voce e struttura alla storia, la regia e la direzione della fotografia costruiscono l'impatto visivo, guidando gli attori e la troupe: una sinergia totale che nasce sul set e si perfeziona in fase di montaggio per valorizzare ogni singolo fotogramma.
            </p>
          </div>
          <CTAButton onClick={onBookClick} className="self-start" />
        </div>
      </div>

    </section>
  );
}
