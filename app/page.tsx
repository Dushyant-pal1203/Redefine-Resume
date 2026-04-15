import HeroSection from "@/components/PageSections/HeroSection";
import TemplateSection from "@/components/PageSections/TemplateSection";
import YourArtifacts from "@/components/PageSections/YourArtifacts";
import HowItWorks from "@/components/PageSections/HowItWorks";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <TemplateSection />
      <YourArtifacts />
    </main>
  );
}
