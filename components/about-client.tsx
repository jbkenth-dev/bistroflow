"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { TypewriterH1 } from "@/components/ui/typewriter";
import { SafeImage } from "@/components/ui/safe-image";
import {
  IconArrowRight,
  IconStar,
  IconChart,
  IconSettings,
  IconUsers,
  IconHome,
  IconPhone,
  IconMapPin,
  IconDineIn,
} from "@/components/ui/icons";

export function AboutClient() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const stats = [
    { label: "Happy Diners", value: "10k+", icon: IconUsers },
    { label: "Premium Dishes", value: "85+", icon: IconStar },
    { label: "Years Excellence", value: "12+", icon: IconChart },
    { label: "Tables Available", value: "24", icon: IconDineIn },
  ];

  const values = [
    {
      title: "Our Heritage",
      description: "Rooted in tradition, East Gate Bistro has been the heart of the community for over a decade, serving authentic flavors with a modern twist.",
      icon: IconHome,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Innovation",
      description: "With BistroFlow, we're blending culinary art with seamless technology to provide the most efficient dining experience in the city.",
      icon: IconSettings,
      color: "bg-primary/10 text-primary"
    },
    {
      title: "Quality First",
      description: "From farm-to-table ingredients to our precision-engineered ordering system, excellence is in every detail of what we do.",
      icon: IconStar,
      color: "bg-yellow-500/10 text-yellow-500"
    }
  ];

  const { scrollYProgress: pageScrollY } = useScroll();
  const scaleX = useTransform(pageScrollY, [0, 1], [0, 1]);

  return (
    <div className="relative pb-20 overflow-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[80vh] md:h-[85vh] min-h-[500px] w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] mb-12 md:mb-20 group">
        <motion.div style={{ y: yParallax }} className="absolute inset-0 z-0">
          <SafeImage
            src="/assets/bistroflow-about.jpg"
            alt="Bistro Story"
            fill
            className="object-cover scale-110 group-hover:scale-105 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 backdrop-blur-[1px]" />
        </motion.div>

        <motion.div
          style={{ opacity: opacityHero }}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border-white/10 backdrop-blur-xl relative overflow-hidden group/hero"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-1000" />

            <div className="mb-4 md:mb-6 inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/90 text-[10px] md:text-sm font-medium tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Our Legacy & Future
            </div>
            <TypewriterH1
              text="Our Story & Vision"
              className="text-5xl sm:text-7xl md:text-9xl font-display font-black mb-4 md:mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-orange-400 to-primary leading-[0.8]"
            />
            <p className="text-lg sm:text-xl md:text-3xl opacity-90 max-w-3xl mx-auto font-light leading-relaxed text-white/80">
              Crafting <span className="text-white font-medium italic">unforgettable culinary journeys</span> through passion, tradition, and digital innovation.
            </p>

            <div className="mt-8 md:mt-12 flex items-center justify-center gap-4 md:gap-8 border-t border-white/10 pt-6 md:pt-8">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-primary">12+</div>
                <div className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-50">Years</div>
              </div>
              <div className="w-px h-6 md:h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-primary">85+</div>
                <div className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-50">Dishes</div>
              </div>
              <div className="w-px h-6 md:h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-primary">10k+</div>
                <div className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-50">Diners</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-4"
          >
            <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">Scroll to Explore</span>
            <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/20 rounded-full flex justify-center p-1 backdrop-blur-sm">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1.5 md:w-1 md:h-2 bg-primary rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 mb-16 md:mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 md:p-8 rounded-2xl md:rounded-3xl text-center group hover:bg-white/10 transition-colors"
            >
              <div className="mb-3 md:mb-4 inline-flex p-2 md:p-3 rounded-xl md:rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="text-2xl md:text-4xl font-bold mb-1">{stat.value}</h3>
              <p className="text-[10px] md:text-sm opacity-60 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="container mx-auto px-4 mb-20 md:mb-32">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 flex items-center gap-4">
              <span className="w-8 md:w-12 h-1 bg-primary rounded-full" />
              The BistroFlow Essence
            </h2>
            <div className="space-y-4 md:space-y-6 text-base md:text-lg opacity-80 leading-relaxed">
              <p>
                BistroFlow was born from a simple yet powerful idea: that technology should enhance,
                not replace, the human connection at the heart of dining.
              </p>
              <p>
                As East Gate Bistro's digital companion, we've transformed operational challenges
                into seamless experiences. Our integrated system ensures that from the moment you
                reserve a table to your final bite, every detail is handled with precision.
              </p>
              <p>
                We believe in transparency, efficiency, and above all, the joy of a perfectly
                timed meal. This is our commitment to the future of hospitality.
              </p>
            </div>

            <div className="mt-8 md:mt-10 flex flex-wrap gap-4">
              <Link href="/menu" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                Explore Our Menu <IconArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative order-1 lg:order-2 mb-8 lg:mb-0"
          >
            <div className="aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden lg:rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl">
              <SafeImage
                src="/assets/food-about.jpg"
                alt="Chef at work"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 glass p-4 md:p-6 rounded-xl md:rounded-2xl max-w-[200px] md:max-w-[240px] shadow-2xl animate-bounce-slow">
              <p className="text-xs md:text-sm italic font-medium">
                "We don't just serve food; we serve memories, powered by innovation."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="container mx-auto px-4 mb-20 md:mb-32">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Core Pillars</h2>
          <p className="opacity-60 max-w-xl mx-auto text-sm md:text-base">The foundation of everything we build and every dish we serve.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 relative overflow-hidden group"
            >
              <div className={`mb-4 md:mb-6 inline-flex p-3 md:p-4 rounded-xl md:rounded-2xl ${value.color} group-hover:scale-110 transition-transform`}>
                <value.icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{value.title}</h3>
              <p className="text-sm md:text-base opacity-70 leading-relaxed">{value.description}</p>
              <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity hidden md:block">
                <value.icon className="w-32 h-32" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tables Display Section */}
      <section className="container mx-auto px-4 mb-20 md:mb-32">
        <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[100px] -z-10" />
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
              <div>
                <span className="text-primary font-bold tracking-widest uppercase text-[10px] md:text-sm mb-2 md:mb-4 block">Seating Experience</span>
                <h2 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">Find Your Perfect Corner</h2>
                <p className="text-base md:text-lg opacity-60 leading-relaxed">
                  From cozy window-side spots for intimate dates to spacious VIP booths for family gatherings,
                  our dining area is designed for comfort and style.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">24</div>
                  <div className="text-[10px] md:text-sm opacity-50 font-medium">Total Tables</div>
                </div>
                <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">80+</div>
                  <div className="text-[10px] md:text-sm opacity-50 font-medium">Guest Capacity</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-4 mt-6 md:mt-8">
                {['Window Side', 'Main Hall', 'VIP Booths', 'Quiet Corner'].map((tag) => (
                  <span key={tag} className="px-3 py-1 md:px-4 md:py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-bold border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="space-y-3 md:space-y-4"
              >
                <div className="relative aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group">
                  <SafeImage
                    src="/assets/table-1.jpg"
                    alt="Window Seating"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 right-3 md:top-6 md:right-6">
                    <span className="glass px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-bold text-green-400 flex items-center gap-1 md:gap-1.5 border border-green-400/20">
                      <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-green-400 animate-pulse" />
                      AVAILABLE
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 text-white text-xs md:text-base font-bold">Window Side</div>
                </div>
                <div className="relative aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group">
                  <SafeImage
                    src="/assets/table-2.jpg"
                    alt="Main Hall"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 right-3 md:top-6 md:right-6">
                    <span className="glass px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-bold text-green-400 flex items-center gap-1 md:gap-1.5 border border-green-400/20">
                      <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-green-400 animate-pulse" />
                      AVAILABLE
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 text-white text-xs md:text-base font-bold">Main Hall</div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-3 md:space-y-4 pt-6 md:pt-8"
              >
                <div className="relative aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group">
                  <SafeImage
                    src="/assets/table-3.jpg"
                    alt="Quiet Corner"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 right-3 md:top-6 md:right-6">
                    <span className="glass px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-bold text-red-400 flex items-center gap-1 md:gap-1.5 border border-red-400/20">
                      <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-red-400" />
                      OCCUPIED
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 text-white text-xs md:text-base font-bold">Quiet Corner</div>
                </div>
                <div className="relative aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group">
                  <SafeImage
                    src="/assets/table-4.jpg"
                    alt="VIP Booths"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 right-3 md:top-6 md:right-6">
                    <span className="glass px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-bold text-green-400 flex items-center gap-1 md:gap-1.5 border border-green-400/20">
                      <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-green-400 animate-pulse" />
                      AVAILABLE
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 text-white text-xs md:text-base font-bold">VIP Booths</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Map Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-primary/10 text-primary">
                    <IconMapPin className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Our Location</h4>
                    <p className="text-sm md:text-base opacity-70 max-w-xs">National Highway beside Sea Oil, Guihulngan City, Negros Oriental</p>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-primary/10 text-primary">
                    <IconPhone className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Get in Touch</h4>
                    <p className="text-sm md:text-base opacity-70 font-medium">0951 676 1071</p>
                    <a href="https://www.facebook.com/Eastgatebistro" target="_blank" className="text-primary hover:underline text-xs md:text-sm font-bold">Follow us on Facebook</a>
                  </div>
                </div>
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-primary/10 text-primary">
                    <IconDineIn className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Service Hours</h4>
                    <p className="text-sm md:text-base opacity-70">Mon - Sat: 11:00 AM - 8:00 PM</p>
                    <p className="opacity-50 italic text-xs md:text-sm">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-12 p-6 md:p-8 rounded-2xl md:rounded-3xl bg-primary/5 border border-primary/10">
                <h4 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                  <IconSettings className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  Powered by BistroFlow
                </h4>
                <p className="text-xs md:text-sm opacity-60 leading-relaxed">
                  Experience the future of dining with our integrated management suite,
                  designed for speed, precision, and the ultimate guest satisfaction.
                </p>
              </div>
            </div>

            <div className="relative h-[300px] md:h-[400px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden ring-1 ring-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3931.23650232139!2d123.2690159!3d10.1182837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33abe3980202cf9d%3A0xdb11899a1529cdb!2sEAST%20GATE%20BISTRO!5e0!3m2!1sen!2sph!4v1628076942474!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                className="transition-all duration-700"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
