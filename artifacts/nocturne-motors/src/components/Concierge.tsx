import { motion } from "framer-motion";
import { Key, Shield, Plane } from "lucide-react";

export function Concierge() {
  const services = [
    {
      icon: <Key className="w-6 h-6 text-primary" />,
      title: "Private Viewing",
      desc: "Experience the machine in absolute solitude. Our showroom is yours."
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Secure Allocation",
      desc: "Discreet acquisition of rare and unlisted allocations worldwide."
    },
    {
      icon: <Plane className="w-6 h-6 text-primary" />,
      title: "Global Delivery",
      desc: "Enclosed, climate-controlled transport to any coordinate on earth."
    }
  ];

  return (
    <section className="relative w-full py-32 bg-black overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mb-16">
          <h2 className="text-xs font-mono text-secondary-foreground uppercase tracking-[0.3em] mb-4">Concierge</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-light text-white mb-6">Beyond Acquisition</h3>
          <p className="text-muted-foreground font-light text-lg">
            We don't just hand over the keys. We facilitate an ownership experience tailored to the exact demands of our clientele.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((svc, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, borderBottomColor: "rgba(255,165,0,0)" }}
              whileInView={{ opacity: 1, borderBottomColor: "rgba(255,165,0,0.5)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="flex flex-col border-b border-primary/0 pb-8 hover:border-primary transition-colors duration-500"
            >
              <div className="mb-6 p-4 rounded-full bg-white/5 inline-flex self-start">{svc.icon}</div>
              <h4 className="text-xl font-serif text-white mb-3">{svc.title}</h4>
              <p className="text-muted-foreground font-light leading-relaxed">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
