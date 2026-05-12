import { BrandIdentity } from "./BrandIdentity";
import { CTAButton } from "./CTAButton";

export function Header({ onBookClick }: { onBookClick: () => void }) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-5 md:px-10 py-4 bg-transparent">
      <BrandIdentity />
      <CTAButton variant="dark" text="Book now" onClick={onBookClick} className="!px-4 !py-2.5 md:!px-4 md:!py-3 [&_span]:!text-[length:calc(20px-2pt)]" />
    </header>
  );
}
