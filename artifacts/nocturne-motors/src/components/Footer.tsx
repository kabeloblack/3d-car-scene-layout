import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-white/5 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-serif text-white mb-6">Nocturne Motors</h2>
            <p className="text-muted-foreground font-light max-w-sm mb-8">
              Curators of the world's most exceptional automotive sculptures. We operate in the shadows to bring light to the extraordinary.
            </p>
            <div className="flex flex-col gap-4 max-w-sm">
              <span className="text-xs font-mono text-primary uppercase tracking-widest">Join the Registry</span>
              <div className="flex gap-2">
                <Input 
                  placeholder="Email address" 
                  className="bg-transparent border-white/10 rounded-none focus-visible:ring-primary focus-visible:border-primary text-white"
                />
                <Button className="rounded-none bg-white text-black hover:bg-primary hover:text-black uppercase tracking-widest text-xs">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-mono uppercase tracking-widest text-xs mb-6">Inventory</h4>
            <ul className="space-y-4 text-muted-foreground font-light text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Hypercars</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Superbikes</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Grand Tourers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Classics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Incoming</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-mono uppercase tracking-widest text-xs mb-6">Contact</h4>
            <ul className="space-y-4 text-muted-foreground font-light text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Inquiries</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-muted-foreground font-mono tracking-widest">
          <p>© {new Date().getFullYear()} Nocturne Motors. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">IG</a>
            <a href="#" className="hover:text-white transition-colors">X</a>
            <a href="#" className="hover:text-white transition-colors">YT</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
