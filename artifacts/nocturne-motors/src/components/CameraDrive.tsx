import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

const VEHICLES = [
  { id: 1, name: "Viper Superleggera", type: "Hypercar", hp: "1,100", speed: "235 mph", img: "/car-5.png" },
  { id: 2, name: "Ghost Panigale", type: "Superbike", hp: "220", speed: "190 mph", img: "/car-1.png" },
  { id: 3, name: "Obsidian GT", type: "Grand Tourer", hp: "750", speed: "211 mph", img: "/car-2.png" },
  { id: 4, name: "Apex R-Track", type: "Hypercar", hp: "1,400", speed: "250 mph", img: "/car-3.png" },
  { id: 5, name: "Neon M-Concept", type: "Motorcycle", hp: "180", speed: "175 mph", img: "/car-4.png" },
];

export function CameraDrive() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Background parallax: moves slightly towards camera and pans up slowly
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  const skylineY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const skylineOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [0.8, 0.5, 0.2]);

  return (
    <section ref={containerRef} className="relative w-full h-[600vh] bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Environment Layers */}
        <motion.div className="absolute inset-0 z-0 origin-bottom" style={{ scale: bgScale, y: bgY }}>
          <img src="/bg-road.png" alt="" className="w-full h-full object-cover object-bottom opacity-60" />
        </motion.div>

        <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: skylineY, opacity: skylineOpacity }}>
          <img src="/bg-skyline.png" alt="" className="w-full h-full object-cover object-top opacity-50" />
        </motion.div>

        <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none mix-blend-overlay"></div>
        <img src="/bg-fog.png" alt="" className="absolute inset-0 z-10 w-full h-full object-cover mix-blend-screen opacity-20 pointer-events-none animate-pulse duration-[10000ms]" />

        {/* Vehicles */}
        {VEHICLES.map((vehicle, index) => {
          // Distribute active ranges over the scroll progress
          // 5 vehicles, so each gets a slice of the 0-1 range
          // E.g., vehicle 0 is active from 0 to 0.2, peaking at 0.1
          const start = index * 0.2;
          const peak = start + 0.1;
          const end = start + 0.2;

          // Scale: starts tiny in distance, grows to massive as it passes
          const scale = useTransform(scrollYProgress, [start, peak, end], [0.2, 1, 2.5]);
          
          // Y position: starts high (horizon), moves down to center, then off bottom
          const y = useTransform(scrollYProgress, [start, peak, end], ["-20%", "10%", "50%"]);
          
          // X position: give them slight stagger left/right
          const isEven = index % 2 === 0;
          const xOffset = isEven ? "5%" : "-5%";
          const x = useTransform(scrollYProgress, [start, peak, end], ["0%", xOffset, isEven ? "20%" : "-20%"]);

          // Opacity: fades in from fog, solid at peak, fades out as it passes camera
          const opacity = useTransform(scrollYProgress, [start - 0.05, peak, end], [0, 1, 0]);
          const zIndex = 20 + index;

          return (
            <motion.div
              key={vehicle.id}
              className="absolute group flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
              style={{ scale, y, x, opacity, zIndex, transformOrigin: "center bottom" }}
            >
              {/* Vehicle Image */}
              <div className="relative">
                <img 
                  src={vehicle.img} 
                  alt={vehicle.name} 
                  className="w-full max-w-[600px] object-contain drop-shadow-[0_10px_20px_rgba(255,165,0,0.1)] transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
                />
                
                {/* Puddle reflection */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-primary/20 blur-xl rounded-[100%] mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Hover Info Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none group-hover:pointer-events-auto z-50 flex flex-col items-center justify-center backdrop-blur-md bg-black/60 border border-primary/20 p-6 rounded-none min-w-[300px]">
                <div className="text-xs text-primary font-mono tracking-widest uppercase mb-1">{vehicle.type}</div>
                <h3 className="text-2xl font-serif text-white mb-4 whitespace-nowrap">{vehicle.name}</h3>
                
                <div className="flex gap-6 mb-6">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Power</span>
                    <span className="text-lg font-mono text-white">{vehicle.hp} HP</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Top Speed</span>
                    <span className="text-lg font-mono text-white">{vehicle.speed}</span>
                  </div>
                </div>

                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-black transition-colors rounded-none tracking-widest uppercase text-xs px-8">
                  Inquire
                </Button>
              </div>
            </motion.div>
          );
        })}

        {/* Global atmospheric vignette */}
        <div className="absolute inset-0 z-[100] pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"></div>
      </div>
    </section>
  );
}
