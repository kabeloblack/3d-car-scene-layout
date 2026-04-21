import { useRef } from "react";
import { useScroll } from "framer-motion";
import { Scene3D } from "@/components/3d/Scene3D";
import { Collection } from "@/components/Collection";
import { Concierge } from "@/components/Concierge";
import { Showroom } from "@/components/Showroom";
import { Footer } from "@/components/Footer";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <main className="w-full bg-background text-foreground overflow-x-hidden">
      {/* Ref container for the scroll progress of the 3D scene */}
      <div ref={containerRef}>
        <Scene3D scrollYProgress={scrollYProgress} />
      </div>

      {/* 2D Sections continue below */}
      <div id="collection">
        <Collection />
      </div>
      <div id="concierge">
        <Concierge />
      </div>
      <div id="showroom">
        <Showroom />
      </div>
      <Footer />
    </main>
  );
}
