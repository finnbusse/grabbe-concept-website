"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { AnimateOnScroll } from "./animate-on-scroll"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { variants } from "@/lib/motion"
import { trackEvent } from "@/lib/analytics"

interface ContactSectionClientProps {
  address: string
  phone: string
  fax: string
  email: string
  schulleiter: string
  stellvertreter: string
  fullName: string
}

export function ContactSectionClient({
  address,
  phone,
  fax,
  email,
  schulleiter,
  stellvertreter,
  fullName,
}: ContactSectionClientProps) {
  const contactItemsRef = useRef<HTMLDivElement>(null)
  const contactItemsInView = useInView(contactItemsRef, { once: true, margin: "0px 0px -60px 0px" })
  const personsRef = useRef<HTMLDivElement>(null)
  const personsInView = useInView(personsRef, { once: true, margin: "0px 0px -60px 0px" })

  const contactItems = [
    {
      icon: MapPin,
      title: "Adresse",
      content: (
        <>
          {fullName}<br />
          {address}
        </>
      ),
    },
    {
      icon: Phone,
      title: "Telefon",
      content: (
        <>
          <a href={`tel:${phone.replace(/[\s-]/g, "")}`} onClick={() => trackEvent("contact_phone_click")} className="hover:text-primary transition-colors">{phone}</a>
          <br />
          <span className="text-xs">{"Fax: "}{fax}</span>
        </>
      ),
    },
    {
      icon: Mail,
      title: "E-Mail",
      content: (
        <a href={`mailto:${email}`} onClick={() => trackEvent("contact_email_click")} className="text-primary hover:underline">{email}</a>
      ),
    },
  ]

  const persons = [
    { name: schulleiter, role: "Schulleiter" },
    { name: stellvertreter, role: "Stellvertretende Schulleitung" },
  ]

  return (
    <section className="relative py-28 lg:py-36 bg-mesh-blue">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          <AnimateOnScroll animation="slide-in-left">
            <div>
              <p className="font-sub text-[11px] uppercase tracking-[0.3em] text-primary">
                Kontakt
              </p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl tracking-tight text-foreground">
                So finden <span className="italic text-primary">Sie uns</span>
              </h2>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed">
                Du bist in höchstens 30 Minuten bei uns - mit Bahn, Bus, Fahrrad oder zu Fuss.
              </p>

              <div ref={contactItemsRef} className="mt-10 space-y-6">
                {contactItems.map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="flex items-start gap-5 group"
                    initial="hidden"
                    animate={contactItemsInView ? "visible" : "hidden"}
                    variants={variants.fadeInUp}
                    transition={{ delay: 0.15 + i * 0.12 }}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-3">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-sub text-xs uppercase tracking-[0.15em] text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimateOnScroll animation="fade-in-up" delay={0.55}>
                <Link
                  href="/kontakt"
                  onClick={() => trackEvent("nav_link_click", { label: "Alle Ansprechpartner", href: "/kontakt" })}
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 group"
                >
                  Alle Ansprechpartner:innen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </AnimateOnScroll>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slide-in-right" delay={0.2}>
            <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-10 transition-all hover:shadow-lg hover:shadow-primary/[0.06]">
              <h3 className="font-display text-2xl text-card-foreground">Schulleitung</h3>
              <div className="mt-2 divider-line mx-0" />
              <div ref={personsRef} className="mt-8 space-y-8">
                {persons.map((person, i) => (
                  <motion.div
                    key={person.name}
                    className="flex items-start gap-5"
                    initial="hidden"
                    animate={personsInView ? "visible" : "hidden"}
                    variants={variants.fadeInUp}
                    transition={{ delay: 0.25 + i * 0.15 }}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-lg text-primary">
                      {person.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-display text-lg text-card-foreground">{person.name}</p>
                      <p className="mt-0.5 font-sub text-xs uppercase tracking-[0.1em] text-muted-foreground">{person.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}
