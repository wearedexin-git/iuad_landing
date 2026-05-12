interface CTAButtonProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "dark";
}

export function CTAButton({ text = "Prenota ora", onClick, className = "", variant = "primary" }: CTAButtonProps) {
  const bgColor = variant === "primary" ? "bg-[#d06321]" : "bg-[#201f1f]";

  return (
    <button
      onClick={onClick}
      className={`${bgColor} cursor-pointer flex items-center justify-center px-6 py-3.5 md:px-8 md:py-5 rounded-full transition-opacity hover:opacity-90 active:scale-[0.98] ${className}`}
    >
      <span className="font-tiempos text-lg md:text-[26px] text-white whitespace-nowrap leading-none">
        {text}
      </span>
    </button>
  );
}
