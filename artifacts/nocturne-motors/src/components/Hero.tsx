import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
        <motion.img 
          src="/hero-car.png" 
          alt="Hero Vehicle" 
          className="w-full h-full object-cover object-center opacity-80"
          initial={{ scale: 1.1, filter: "brightness(0.5)" }}
          animate={{ scale: 1, filter: "brightness(1)" }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-primary tracking-[0.2em] text-sm md:text-base font-mono uppercase mb-4">Nocturne Motors</h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white font-light tracking-tight leading-tight mb-6 text-shadow-xl">
            Own the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Midnight</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-sans font-light">
            Hand-curated, high-end machines. Presented not as inventory, but as sculpture under the streetlamps.
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-12 z-20 flex flex-col items-center justify-center opacity-50"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-xs uppercase tracking-widest mb-2 font-mono text-muted-foreground">Descend</span>
        <ChevronDown className="w-5 h-5 text-primary" />
      </motion.div>
    </section>
  );
}
