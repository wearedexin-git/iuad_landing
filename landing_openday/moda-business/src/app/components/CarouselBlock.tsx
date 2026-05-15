import { useRef, useState, useEffect } from "react";
import imgRectangle11 from "../../assets/carousel_image_1.jpg";
import imgRectangle1 from "../../assets/carousel_image_2.jpg";
import imgRectangle2 from "../../assets/carousel_image_3.jpg";
import imgRectangle4 from "../../assets/carousel_image_4.jpg";
import imgRectangle12 from "../../assets/carousel_image_5.jpg";
import imgRectangle3 from "../../assets/carousel_image_6.jpg";
import imgRectangle5 from "../../assets/carousel_image_7.jpg";
import imgRectangle8 from "../../assets/carousel_image_8.jpg";
import imgRectangle14 from "../../assets/carousel_image_9.jpg";
import imgRectangle10 from "../../assets/carousel_image_10.jpg";
import svgPaths from "../../imports/svg-ffe0txzxzn";
import { CTAButton } from "./CTAButton";
import { LazyImage } from "./LazyImage";

const images = [
  imgRectangle11,
  imgRectangle1,
  imgRectangle2,
  imgRectangle4,
  imgRectangle12,
  imgRectangle3,
  imgRectangle5,
  imgRectangle8,
  imgRectangle14,
  imgRectangle10,
];

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  const flip = direction === "left" ? "rotate-180" : "";
  return (
    <div className={`w-[43px] h-[47px] ${flip}`}>
      <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 43.1932 47.4584">
        <path d={svgPaths.p2d930ef0} fill="#8D9EBD" />
      </svg>
    </div>
  );
}

export function CarouselBlock({ onBookClick }: { onBookClick: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    ref?.addEventListener("scroll", checkScroll);
    return () => ref?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = dir === "left" ? -382 : 382;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-[#D6E2F0] py-16 md:py-24 overflow-hidden">
      <div className="px-5 md:px-10 lg:px-[calc(8.33%+35px)]">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="font-tiempos text-[32px] md:text-[48px] lg:text-[58px] text-[#8D9EBD] leading-[1.1]">
            Le esperienze degli studenti
          </h2>
          <div className="hidden md:flex gap-4 items-center">
            <button
              onClick={() => scroll("left")}
              className={`cursor-pointer transition-opacity ${canScrollLeft ? "opacity-100" : "opacity-30"}`}
              disabled={!canScrollLeft}
              aria-label="Scorri a sinistra"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              onClick={() => scroll("right")}
              className={`cursor-pointer transition-opacity ${canScrollRight ? "opacity-100" : "opacity-30"}`}
              disabled={!canScrollRight}
              aria-label="Scorri a destra"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 px-5 md:px-10 lg:px-[calc(8.33%+35px)] scroll-pl-5 md:scroll-pl-10 lg:scroll-pl-[calc(8.33%+35px)] scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="shrink-0 w-[280px] md:w-[366px] h-[400px] md:h-[525px] rounded-lg overflow-hidden relative snap-start"
          >
            <LazyImage
              alt={`Esperienza studente ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              src={img}
            />
            <div className="absolute inset-0 border border-[#8D9EBD] rounded-lg" />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10 md:mt-14">
        <CTAButton onClick={onBookClick} />
      </div>
    </section>
  );
}
