import svgPaths from "../../imports/svg-ffe0txzxzn";

interface EyeIconProps {
  className?: string;
  variant?: "large" | "medium" | "small" | "tiny";
}

const viewBoxes = {
  large: "0 0 611.388 380.152",
  medium: "0 0 235.338 146.33",
  small: "0 0 91.5585 56.9297",
  tiny: "0 0 41.7313 25.9479",
};

const pathSets = {
  large: {
    p1: svgPaths.p21475fc0,
    p2: svgPaths.p1124fa00,
    p3: svgPaths.p2bde6800,
    strokeWidth: "28.0821",
  },
  medium: {
    p1: svgPaths.p17b9aa00,
    p2: svgPaths.p3dfbd280,
    p3: svgPaths.p29bd900,
    strokeWidth: "10.8095",
  },
  small: {
    p1: svgPaths.p13753300,
    p2: svgPaths.p1f54b680,
    p3: svgPaths.p35200e00,
    strokeWidth: "4.20544",
  },
  tiny: {
    p1: svgPaths.p27934200,
    p2: svgPaths.p1ca6af0,
    p3: svgPaths.p2d239100,
    strokeWidth: "1.91679",
  },
};

export function EyeIcon({ className = "", variant = "large" }: EyeIconProps) {
  const paths = pathSets[variant];
  const viewBox = viewBoxes[variant];

  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox={viewBox}>
        <path d={paths.p1} fill="#8D9EBD" stroke="white" strokeWidth={paths.strokeWidth} />
        <path d={paths.p2} fill="#010101" />
        <path d={paths.p3} fill="#D6E2F0" />
      </svg>
    </div>
  );
}
