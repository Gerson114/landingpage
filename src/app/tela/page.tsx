import Navigation from "./components/navigation";
import HeroSection from "./components/hero";
import FeaturesSection from "./components/features";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navegação do site */}
      <Navigation />

      {/* Seção principal / Hero */}
      <section aria-label="Seção principal">
        <HeroSection />
      </section>

      {/* Seção de funcionalidades */}
      <section aria-label="Funcionalidades">
        <FeaturesSection />
      </section>
    </main>
  );
}
