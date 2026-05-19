import { useCallback } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { TextBlock } from "./components/TextBlock";
import { CoppiaCreativaBlock } from "./components/CoppiaCreativaBlock";
import { CourseBlock } from "./components/CourseBlock";
import { CarouselBlock } from "./components/CarouselBlock";
import { PlusBlock } from "./components/PlusBlock";
import { TestimonialBlock } from "./components/TestimonialBlock";
import { Footer } from "./components/Footer";

export default function App() {
  const scrollToForm = useCallback(() => {
    const formSection = document.getElementById("form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#fbdee6] overflow-x-hidden">
        <Header onBookClick={scrollToForm} />
        <main>
          <HeroSection onBookClick={scrollToForm} />
          <TextBlock onBookClick={scrollToForm} />
          <CoppiaCreativaBlock onBookClick={scrollToForm} />
          <CourseBlock onBookClick={scrollToForm} />
          <CarouselBlock onBookClick={scrollToForm} />
          <PlusBlock onBookClick={scrollToForm} />
          <TestimonialBlock onBookClick={scrollToForm} />
          <Footer />
        </main>
      </div>
    </ErrorBoundary>
  );
}
