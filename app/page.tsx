import HeroSection from "@/components/PageSections/HeroSection";
import TemplateSection from "@/components/PageSections/TemplateSection";
import YourArtifacts from "@/components/PageSections/YourArtifacts";
// import Dashboard from "@/components/PageSections/Dashboard";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TemplateSection />
      <YourArtifacts />
      {/* <Dashboard /> */}
    </main>
  );
}
