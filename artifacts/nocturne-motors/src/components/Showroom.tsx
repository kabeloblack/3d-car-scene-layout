import { motion } from "framer-motion";

export function Showroom() {
  return (
    <section className="relative w-full h-[80vh] bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/showroom.png" 
          alt="Showroom" 
          className="w-full h-full object-cover opacity-40 grayscale-[30%] hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/80 mix-blend-multiply" />
      </div>

      <div className="relative z-10 container mx-auto px-6 flex justify-end">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-md bg-black/80 backdrop-blur-xl p-12 border border-white/10"
        >
          <h2 className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-4">Location</h2>
          <h3 className="text-3xl font-serif text-white mb-8">The Gallery</h3>
          
          <address className="not-italic text-muted-foreground font-light space-y-2 mb-8">
            <p>104 Midnight Blvd</p>
            <p>Sector 4, Neo District</p>
            <p>By appointment only.</p>
          </address>

          <a href="#" className="inline-flex items-center gap-2 text-sm font-mono text-white hover:text-primary transition-colors uppercase tracking-widest group">
            <span className="border-b border-primary/30 group-hover:border-primary pb-1 transition-colors">Request Access</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
