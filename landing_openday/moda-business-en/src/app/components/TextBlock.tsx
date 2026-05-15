import { CTAButton } from "./CTAButton";
import { FashionIcon } from "./FashionIcon";

export function TextBlock({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section className="relative bg-white py-20 md:py-32 px-5 md:px-10 lg:px-[calc(8.33%+35px)] overflow-hidden">
      <div className="max-w-[1130px] mx-auto">
        <div className="font-sarabun font-normal text-[32px] md:text-[48px] lg:text-[64px] text-black leading-[1.16] mb-10 md:mb-14">
        Don&apos;t just design fashion — learn to manage it. Here you become the professional who leads the market.{" "}
          <FashionIcon className="inline-block align-middle w-[48px] h-[30px] md:w-[72px] md:h-[45px] lg:w-[92px] lg:h-[57px]" />
        </div>
        <CTAButton onClick={onBookClick} />
      </div>
    </section>
  );
}
