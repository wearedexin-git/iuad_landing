import { useRef, useState } from "react";
import { CTAButton } from "./CTAButton";
import { VideoSkeleton } from "./SkeletonLoaders";

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full max-w-[440px] xl:w-[440px] shrink-0">
      <div className="relative rounded-[12px] overflow-hidden border-2 border-[#8D9EBD] aspect-[9/16] bg-[#201f1f]">
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <VideoSkeleton />
          </div>
        )}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={handleLoadedData}
        >
          <source src={`${import.meta.env.BASE_URL}assets/video/video_couse.mp4`} type="video/mp4" />
        </video>

        {/* Bottone mute/unmute */}
        {!isLoading && (
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Attiva audio" : "Disattiva audio"}
            className="absolute bottom-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 transition-colors cursor-pointer"
          >
            {isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function CourseBlock({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section className="relative bg-white py-16 md:py-24 overflow-hidden">
      <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-16 px-5 md:px-10 justify-center xl:px-[calc(8.33%+35px)]">
        {/* Content */}
        <div className="flex flex-col gap-8 md:gap-10 max-w-[670px]">
          <div className="flex flex-col gap-6">
            <h2 className="font-tiempos text-[36px] md:text-[48px] lg:text-[58px] text-[#8D9EBD] leading-[1.1]">
            Tecnica e narrazione
            </h2>
            <p className="font-sarabun font-light text-[20px] md:text-[24px] lg:text-[28px] text-[#201f1f] leading-[1.4]">
            <span className="font-bold">Durante il Master studierai Modellistica industriale e Progettazione grafica 2D, ma imparerai anche a muoverti sui software richiesti dalle grandi aziende di abbigliamento.</span> Dai laboratori CAD con il software Lectra per lo sviluppo del cartamodello bidimensionale, fino alle frontiere della simulazione tridimensionale con CLO3D, acquisirai gli strumenti per gestire ogni fase della pipeline di sviluppo prodotto, compresi lo styling e l'organizzazione d'impresa.
            </p>
          </div>
          <CTAButton onClick={onBookClick} className="self-start" />
        </div>

        <VideoPlayer />
      </div>
    </section>
  );
}
