import { Hero } from "@/components/Hero";
import { CameraDrive } from "@/components/CameraDrive";
import { Collection } from "@/components/Collection";
import { Concierge } from "@/components/Concierge";
import { Showroom } from "@/components/Showroom";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full bg-background text-foreground overflow-x-hidden">
      <Hero />
      <CameraDrive />
      <Collection />
      <Concierge />
      <Showroom />
      <Footer />
    </main>
  );
}
