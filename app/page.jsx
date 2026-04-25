import Image from "next/image";
import { HeroSection, FeatureSection, Stats, Workings, Testimontials, FrequentQuestions, CTA } from "@/components/index";

export default function Home() {
  return (
    <div>
      <div className="grid-bg"></div>

      {/* Hero Section */}
      <HeroSection/>
      <FeatureSection/>
      <Stats/>
      <Workings/>
      <Testimontials/>
      <FrequentQuestions/>
      <CTA/>
    </div>
  );
}
