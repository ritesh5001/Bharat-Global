import { getPublicPrograms, getPublicUniversities, getSiteSettings } from "@/lib/data";
import { SiteProvider } from "@/components/site/site-context";
import { AnnouncementBar, Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { Explorer } from "@/components/site/explorer";
import { Modals } from "@/components/site/modals";
import { CompareTray, Footer, Toast, WhatsAppFab, WhyChoose } from "@/components/site/sections";

// Re-render at most every 60s; admin changes also trigger revalidatePath("/").
export const revalidate = 60;

export default async function HomePage() {
  const [universities, programs, s] = await Promise.all([getPublicUniversities(), getPublicPrograms(), getSiteSettings()]);
  const settings = { phone: s.phone, whatsapp: s.whatsapp, email: s.email, address: s.address, helplineHours: s.helplineHours };

  return (
    <SiteProvider universities={universities} programs={programs} settings={settings}>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <Explorer />
        <WhyChoose />
      </main>
      <Footer />
      <CompareTray />
      <WhatsAppFab />
      <Modals />
      <Toast />
    </SiteProvider>
  );
}
