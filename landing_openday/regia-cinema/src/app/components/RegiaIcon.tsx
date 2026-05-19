import { useId } from "react";
import svgRegia from "../../imports/svg-regia";

interface RegiaIconProps {
  className?: string;
}

const perforationPaths = [
  svgRegia.perforation1,
  svgRegia.perforation2,
  svgRegia.perforation3,
  svgRegia.perforation4,
  svgRegia.perforation5,
  svgRegia.perforation6,
  svgRegia.perforation7,
  svgRegia.perforation8,
] as const;

export function RegiaIcon({ className = "" }: RegiaIconProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `filter0_d_regia_${uid}`;
  const maskId = `mask0_regia_${uid}`;

  return (
    <div className={className}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox={svgRegia.viewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={`url(#${filterId})`}>
          <path
            d={svgRegia.frame}
            fill="#D85A72"
            stroke="white"
            strokeWidth="7"
          />
          <mask
            id={maskId}
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="45"
            y="47"
            width="173"
            height="173"
          >
            <path d={svgRegia.maskBounds} fill="white" />
          </mask>
          <g mask={`url(#${maskId})`}>
            <path d={svgRegia.innerBg} fill="#76211E" />
            {perforationPaths.map((d) => (
              <path key={d} d={d} fill="#010101" />
            ))}
          </g>
        </g>
        <defs>
          <filter
            id={filterId}
            x="0"
            y="0"
            width="265"
            height="265"
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
              result="effect1_dropShadow_regia"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_regia"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
