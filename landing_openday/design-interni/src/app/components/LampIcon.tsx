import { useId } from "react";
import svgPaths from "../../imports/svg-interni";

interface LampIconProps {
  className?: string;
  variant?: "large" | "medium" | "small" | "tiny";
  withShadow?: boolean;
}

const viewBox = "0 0 270 270";

export function LampIcon({
  className = "",
  variant = "large",
  withShadow = false,
}: LampIconProps) {
  const filterId = `lamp_drop_shadow_${variant}_${useId().replace(/:/g, "")}`;

  const paths = (
    <>
      <path
        d={svgPaths.p8514a000}
        fill="#C5DECC"
        stroke="white"
        strokeWidth="7"
      />
      <path d={svgPaths.p8514b000} fill="#3E5146" />
      <path d={svgPaths.p8514c000} fill="#577061" />
      <path d={svgPaths.p8514d000} fill="#010101" />
      <path d={svgPaths.p8514e000} fill="#010101" />
    </>
  );

  return (
    <div className={className} aria-hidden>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox={viewBox}
      >
        {withShadow && (
          <defs>
            <filter
              id={filterId}
              x="-0.015625"
              y="-0.0158691"
              width="270.031"
              height="269.659"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow"
                result="shape"
              />
            </filter>
          </defs>
        )}
        <g filter={withShadow ? `url(#${filterId})` : undefined}>{paths}</g>
      </svg>
    </div>
  );
}
