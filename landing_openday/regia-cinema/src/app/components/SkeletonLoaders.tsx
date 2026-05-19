/**
 * Skeleton loader per video mentre carica
 */
export function VideoSkeleton() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#e5cbb8] via-[#fbdee6] to-[#ead4c3] animate-pulse flex items-center justify-center">
      <svg
        className="w-16 h-16 text-[#801718] opacity-50"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}

/**
 * Skeleton loader per immagini
 */
export function ImageSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-br from-[#e5cbb8] via-[#fbdee6] to-[#ead4c3] animate-pulse ${className}`}
    />
  );
}

/**
 * Skeleton per card testimonial
 */
export function TestimonialSkeleton() {
  return (
    <div className="bg-white flex flex-col gap-4 p-8 md:p-10 rounded-3xl border-2 border-[#801718] w-full h-full animate-pulse">
      <div className="w-[50px] h-[35px] md:w-[69px] md:h-[48px] bg-[#fbdee6] rounded" />
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-[42px] h-[42px] bg-[#fbdee6] rounded-full" />
          <div className="flex-1 h-6 bg-[#fbdee6] rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-[#fbdee6] rounded w-full" />
          <div className="h-4 bg-[#fbdee6] rounded w-5/6" />
          <div className="h-4 bg-[#fbdee6] rounded w-4/5" />
        </div>
      </div>
    </div>
  );
}
