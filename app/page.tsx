import HeroSection from "@/components/PageSections/HeroSection";
import TemplateSection from "@/components/PageSections/TemplateSection";
import YourArtifacts from "@/components/PageSections/YourArtifacts";
// import DashboardStats from "@/components/PageSections/DashboardStats";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TemplateSection />
      <YourArtifacts />
      {/* <DashboardStats /> */}
    </main>
  );
}
