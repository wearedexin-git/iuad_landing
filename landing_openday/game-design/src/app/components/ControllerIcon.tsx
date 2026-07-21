type ControllerIconVariant = "large" | "medium" | "small" | "tiny";

interface ControllerIconProps {
  className?: string;
  variant?: ControllerIconVariant;
}

const viewBoxes: Record<ControllerIconVariant, string> = {
  large: "0 0 101.85 101.85",
  medium: "0 0 101.85 101.85",
  small: "0 0 101.85 101.85",
  tiny: "0 0 101.85 101.85",
};

export function ControllerIcon({ className = "", variant = "large" }: ControllerIconProps) {
  const viewBox = viewBoxes[variant];

  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox={viewBox}>
        <rect
          fill="#F0E64D"
          height="72.02"
          transform="translate(-21.09 50.93) rotate(-45)"
          width="72.02"
          x="14.92"
          y="14.92"
        />
        <path
          d="M29.99,33.56c1.52-1.52,4.1-2.73,6.26-2.92h29.56c4.24.43,8.12,4.11,8.79,8.33.79,4.95,1.36,12.27,1.63,17.34.47,8.92-4.3,15.62-13.83,14.76-4.76-.43-7.46-4.82-11.22-4.98-3.45-.15-5.55,2.9-8.33,4.11-6.54,2.85-14.49-.52-16.76-7.3-1.23-3.66.18-15.54.69-19.97.4-3.43.66-6.82,3.22-9.38Z"
          fill="#030304"
        />
        <circle cx="63.3" cy="42.04" fill="#FBF6C3" r="3.99" />
        <circle cx="63.3" cy="52.29" fill="#B2AB38" r="3.99" />
        <rect
          fill="#F0E64D"
          height="13.34"
          transform="translate(-21.7 42.85) rotate(-45)"
          width="13.34"
          x="34.21"
          y="40.95"
        />
      </svg>
    </div>
  );
}
