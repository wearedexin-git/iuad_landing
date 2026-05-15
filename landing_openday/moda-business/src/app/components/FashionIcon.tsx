import fashionIcon from "../../assets/fashion_icon.svg";

interface FashionIconProps {
  className?: string;
  /** Classi extra sull’`img` (es. `object-left object-bottom` per ancorare il disegno in un angolo). */
  imgClassName?: string;
}

/** Icona decorativa moda — stesso ruolo del precedente `EyeIcon` su questa landing. */
export function FashionIcon({ className = "", imgClassName = "" }: FashionIconProps) {
  return (
    <div className={className}>
      <img
        src={fashionIcon}
        alt=""
        className={`block size-full object-contain pointer-events-none select-none ${imgClassName}`.trim()}
        decoding="async"
        draggable={false}
        aria-hidden
      />
    </div>
  );
}
