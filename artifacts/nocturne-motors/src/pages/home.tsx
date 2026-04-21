import { Scene3D } from "@/components/3d/Scene3D";

export default function Home() {
  return (
    <main className="w-screen h-screen bg-background text-foreground overflow-hidden fixed inset-0">
      <Scene3D />
    </main>
  );
}
