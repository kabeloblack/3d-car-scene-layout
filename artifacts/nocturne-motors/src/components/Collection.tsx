import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Collection() {
  const collection = [
    { title: "Vulcan V12", category: "Track Only", img: "/car-3.png" },
    { title: "Phantom 8", category: "Luxury Sedan", img: "/car-2.png" },
    { title: "Streetfighter X", category: "Naked Bike", img: "/car-4.png" },
  ];

  return (
    <section className="relative w-full py-32 bg-background border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-4">The Vault</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-light text-white">Curated Selection</h3>
          </div>
          <button className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors group">
            <span className="uppercase tracking-widest">View All Inventory</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collection.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] bg-card overflow-hidden mb-6 border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                <img 
                  src={item.img} 
                  alt={item.title}
                  className="w-full h-full object-cover object-center opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                />
                <div className="absolute bottom-6 left-6 z-20">
                  <p className="text-xs text-primary font-mono tracking-widest uppercase mb-2">{item.category}</p>
                  <h4 className="text-2xl font-serif text-white">{item.title}</h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
