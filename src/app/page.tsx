import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Intro } from "@/components/home/Intro";
import { ServicesGrid } from "@/components/home/ServicesGrid";
// import { SelectedWork } from "@/components/home/SelectedWork";
import { WhyNmn } from "@/components/home/WhyNmn";
import { Process } from "@/components/home/Process";
import { TechStack } from "@/components/home/TechStack";
import { CtaBand } from "@/components/ui/CtaBand";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: `${site.name} | Software Development Studio: Websites, Custom Software & Web Apps` },
  description:
    "NMN.DEV is an independent software development studio. We design and build high-performance websites, custom software, web applications, SaaS products and automation.",
  alternates: { canonical: site.url },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Intro />
      <ServicesGrid />
      {/* <SelectedWork /> */}
      <WhyNmn />
      <Process />
      <TechStack />
      <CtaBand />
    </>
  );
}
