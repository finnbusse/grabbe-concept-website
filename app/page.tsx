import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/hero-section"
import { WelcomeSection } from "@/components/welcome-section"
import { ProfileSection } from "@/components/profile-section"
import { InfoSection } from "@/components/info-section"
import { NachmittagSection } from "@/components/nachmittag-section"
import { ContactSection } from "@/components/contact-section"
import { PartnersSection } from "@/components/partners-section"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <WelcomeSection />
        <ProfileSection />
        <InfoSection />
        <NachmittagSection />
        <ContactSection />
        <PartnersSection />
      </main>
      <SiteFooter />
    </>
  )
}
