 "use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
 import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
 import { TypewriterH1 } from "@/components/ui/typewriter";
 import { SafeImage } from "@/components/ui/safe-image";
import { IconArrowRight, IconStar, IconChart, IconSettings, IconUsers, IconHome, IconList, IconClose, IconChevronDown, IconPhone, IconMapPin, IconDineIn } from "@/components/ui/icons";

 export function AboutClient() {
   const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] as any });
   const yParallax = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const slides = [
    {
      src: "https://picsum.photos/id/1080/1600/900",
      alt: "Chef plating a signature dish"
    },
    {
      src: "https://picsum.photos/id/1035/1600/900",
      alt: "Elegant table setting"
    },
    {
      src: "https://picsum.photos/id/1069/1600/900",
      alt: "Guests enjoying the ambience"
    }
  ];
  const [slideIndex, setSlideIndex] = useState(0);
  const cardData = [
    {
      title: "Background",
      icon: IconHome,
      content: [
        "The rapid advancement of information technology has significantly transformed business operations across various industries, including the food service sector. Restaurants are increasingly adopting digital systems to improve efficiency, accuracy, and customer satisfaction. However, many small to medium-sized dining establishments still rely on manual or semi-manual processes for food ordering and table reservations.",
        "These traditional methods often result in operational inefficiencies such as delayed order processing, reservation conflicts, miscommunication between staff, and difficulty in managing customer data. As customer expectations continue to rise, the need for an integrated and automated solution becomes essential."
      ]
    },
    {
      title: "Operational Challenges",
      icon: IconList,
      content: [
        "East Gate Bistro currently faces challenges associated with managing food orders and reservations through conventional methods. Manual order taking increases the likelihood of errors, slows down service delivery, and makes it difficult for kitchen staff to prioritize and track orders efficiently.",
        "Handling table reservations without a centralized system can lead to overbooking, underutilization of seating capacity, and customer dissatisfaction due to long waiting times. These issues hinder the restaurant’s ability to provide a consistent, high-quality dining experience."
      ]
    },
    {
      title: "Proposed Solution",
      icon: IconSettings,
      content: [
        "The project titled “BistroFlow: Integrated Food Order and Reservation System for East Gate Bistro” addresses these challenges by combining food ordering and reservation management into a single platform. The integration ensures seamless coordination between customers, service staff, kitchen personnel, and management.",
        "By automating order entry and reservation tracking, the system reduces human error, accelerates service processes, and ensures accurate monitoring of table availability and order status."
      ]
    },
    {
      title: "Benefits",
      icon: IconStar,
      content: [
        "BistroFlow enhances operational efficiency with real-time updates on orders and reservations. Kitchen staff can prioritize preparation, while front-of-house staff manage table assignments and customer flow efficiently.",
        "Customers benefit from faster processing, reduced waiting times, and convenient advance reservations."
      ]
    },
    {
      title: "Management Insights",
      icon: IconChart,
      content: [
        "The system generates organized, reliable data on sales, customer preferences, peak hours, and reservation trends. These insights support informed decision-making, performance evaluation, inventory planning, and strategic improvements.",
        "The platform enables scalability, supporting future features like online ordering and loyalty programs."
      ]
    },
    {
      title: "Academic Context",
      icon: IconUsers,
      content: [
        "This capstone project applies systems analysis, software development, database management, and UI design to a real-world problem. It demonstrates how information systems can effectively resolve operational challenges in the food service industry, contributing to East Gate Bistro’s digital transformation with a practical, efficient, and sustainable solution."
      ]
    },
    {
      title: "Contact Details",
      icon: IconPhone,
      content: [
        "Reach East Gate Bistro for reservations, inquiries, and events.",
        "Email: info@eastgatebistro.com • Phone: +63 900 000 0000",
        "Address: 123 East Gate Ave, Metro City, PH 1000"
      ]
    },
    {
      title: "Floor Plan for Reservations",
      icon: IconMapPin,
      content: [
        "Visual overview of table layout to assist reservations.",
        "Sample floor plan with availability indicators."
      ]
    }
  ];
  const [openFlags, setOpenFlags] = useState<boolean[]>(Array(cardData.length).fill(true));
   const [loadedSlides, setLoadedSlides] = useState<boolean[]>(Array(slides.length).fill(false));
   useEffect(() => {
     const t = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 4000);
     return () => clearInterval(t);
   }, [slides.length]);
   useEffect(() => {
     const t = setTimeout(() => setLoading(false), 900);
     return () => clearTimeout(t);
   }, []);
   return (
     <div>
       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
         <TypewriterH1 text="About BistroFlow" glow className="font-display text-3xl font-bold" />
         <p className="mt-2 opacity-80">Integrated Food Order and Reservation System for East Gate Bistro.</p>
       </motion.div>

      <motion.div
        ref={heroRef}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 glass rounded-3xl overflow-hidden relative"
      >
        {!imgLoaded && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="relative aspect-[3/1]">
              <div className="absolute inset-0 skeleton" />
            </div>
          </div>
        )}
        <motion.div style={{ y: yParallax }} className="relative aspect-[3/1]">
          <motion.div
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 1, scale: [1, 1.02, 1] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <SafeImage
              src="https://picsum.photos/id/1059/1600/533"
              alt="Live ambience at East Gate Bistro"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1400px"
              unoptimized
              loading="eager"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzY2JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nNjYnIGZpbGw9JyNlZWUnIC8+PC9zdmc+"
              fallbackSrc="https://placehold.co/1600x533/2e2e2e/ffffff?text=East+Gate+Bistro"
              onLoadingComplete={() => setImgLoaded(true)}
              onImageError={() => setImgLoaded(true)}
              fallbackClassName="bg-muted"
            />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6"
        >
          <div className="glass rounded-2xl px-4 py-3 inline-flex items-center gap-2 backdrop-blur">
            <span className="font-semibold">Live Bistro Ambience</span>
            <span className="text-xs opacity-80">Captured on location</span>
          </div>
        </motion.div>
      </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="relative glass rounded-2xl p-5 border border-white/10 hover:bg-white/7 hover:ring-1 hover:ring-primary/40 transition-all overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={() =>
              setOpenFlags((prev) => {
                const next = [...prev];
                next[6] = !next[6];
                return next;
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setOpenFlags((prev) => {
                  const next = [...prev];
                  next[6] = !next[6];
                  return next;
                });
            }}
            tabIndex={0}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-2xl"
            />
            <div className="relative z-10">
              <div className="glass rounded-xl p-4 bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                    <span className="glass rounded-lg p-2">
                      <IconPhone className="w-4 h-4" />
                    </span>
                    <h3 className="font-semibold">Contact Details</h3>
                  </div>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: openFlags[6] ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="glass rounded-lg p-2"
                  >
                    <IconChevronDown className="w-4 h-4" />
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {openFlags[6] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -4 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="space-y-2 text-sm opacity-95">
                        {cardData[6].content.map((t, i) => (
                          <p key={i}>{t}</p>
                        ))}
                      </div>
                      <div className="mt-3 glass rounded-2xl overflow-hidden border border-white/10">
                        <div className="relative aspect-[16/9]">
                          <SafeImage
                            src="https://images.unsplash.com/photo-1549923746-d6b5b04a0c39?q=80&w=1600&auto=format&fit=crop"
                            alt="East Gate Bistro location and frontage"
                            fill
                            className="object-cover"
                            unoptimized
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzY2JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nNjYnIGZpbGw9JyNlZWUnIC8+PC9zdmc+"
                            fallbackSrc="https://placehold.co/1600x900/2e2e2e/ffffff?text=Contact+%26+Location"
                            fallbackClassName="bg-muted"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <Link href="mailto:info@eastgatebistro.com" className="glass rounded-full px-3 py-1 ring-1 ring-white/10 hover:bg-white/7 transition-all inline-flex items-center gap-1">
                          <IconArrowRight className="w-3 h-3" />
                          <span>Email Us</span>
                        </Link>
                        <Link href="tel:+639000000000" className="glass rounded-full px-3 py-1 ring-1 ring-white/10 hover:bg-white/7 transition-all inline-flex items-center gap-1">
                          <IconPhone className="w-3 h-3" />
                          <span>Call</span>
                        </Link>
                        <Link href="/contact" className="glass rounded-full px-3 py-1 ring-1 ring-white/10 hover:bg-white/7 transition-all inline-flex items-center gap-1">
                          <IconArrowRight className="w-3 h-3" />
                          <span>Contact Page</span>
                        </Link>
                        <Link href="https://www.google.com/maps/search/?api=1&query=123%20East%20Gate%20Ave%2C%20Metro%20City%2C%20PH%201000" className="glass rounded-full px-3 py-1 ring-1 ring-white/10 hover:bg-white/7 transition-all inline-flex items-center gap-1">
                          <IconMapPin className="w-3 h-3" />
                          <span>View Map</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="relative glass rounded-2xl p-5 border border-white/10 md:col-span-2 hover:bg-white/7 hover:ring-1 hover:ring-primary/40 transition-all overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={() =>
              setOpenFlags((prev) => {
                const next = [...prev];
                next[7] = !next[7];
                return next;
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setOpenFlags((prev) => {
                  const next = [...prev];
                  next[7] = !next[7];
                  return next;
                });
            }}
            tabIndex={0}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-orange-400/20 blur-2xl"
            />
            <div className="relative z-10">
              <div className="glass rounded-xl p-4 bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                    <span className="glass rounded-lg p-2">
                      <IconMapPin className="w-4 h-4" />
                    </span>
                    <h3 className="font-semibold">Floor Plan for Reservations</h3>
                  </div>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: openFlags[7] ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="glass rounded-lg p-2"
                  >
                    <IconChevronDown className="w-4 h-4" />
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {openFlags[7] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -4 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="space-y-2 text-sm opacity-95">
                        {cardData[7].content.map((t, i) => (
                          <p key={i}>{t}</p>
                        ))}
                      </div>
                      {(() => {
                        const layout = [
                          { id: "A1", status: "Available", capacity: 2 },
                          { id: "A2", status: "Reserved", capacity: 4 },
                          { id: "A3", status: "Occupied", capacity: 2 },
                          { id: "B1", status: "Available", capacity: 4 },
                          { id: "B2", status: "Reserved", capacity: 6 },
                          { id: "B3", status: "Available", capacity: 2 },
                          { id: "C1", status: "Occupied", capacity: 4 },
                          { id: "C2", status: "Available", capacity: 6 },
                          { id: "C3", status: "Reserved", capacity: 2 }
                        ];
                        const counts = layout.reduce(
                          (acc, t) => {
                            acc[t.status as "Available" | "Reserved" | "Occupied"]++;
                            return acc;
                          },
                          { Available: 0, Reserved: 0, Occupied: 0 }
                        );
                        return (
                          <>
                            <div className="mt-3 grid grid-cols-3 gap-3">
                              {layout.map((t) => {
                                const base =
                                  t.status === "Available"
                                    ? "bg-green-500/20 text-green-500"
                                    : t.status === "Reserved"
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-orange-400/20 text-orange-400";
                                return (
                                  <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`relative glass rounded-xl aspect-square p-3 ring-2 ring-white/20 hover:bg-white/7 hover:ring-primary/40 shadow-sm shadow-black/20 transition-all ${base}`}
                                    aria-label={`${t.id} • ${t.status} • ${t.capacity} seats`}
                                  >
                                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                                      <SafeImage
                                        src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=600&auto=format&fit=crop"
                                        alt={`${t.id} background`}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                        fallbackSrc="https://placehold.co/600x600/2e2e2e/ffffff?text=Table"
                                        fallbackClassName="bg-muted"
                                      />
                                    </div>
                                    {(() => {
                                      const overlay =
                                        t.status === "Available"
                                          ? "from-green-500/15"
                                          : t.status === "Reserved"
                                          ? "from-red-500/15"
                                          : "from-orange-400/15";
                                      return (
                                        <span className={`pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br ${overlay} to-transparent`} />
                                      );
                                    })()}
                                    <div className="relative z-10 inline-flex items-center gap-3">
                                      <div className="relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/10">
                                        <SafeImage
                                          src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=200&auto=format&fit=crop"
                                          alt={`${t.id} thumbnail`}
                                          fill
                                          className="object-cover"
                                          unoptimized
                                          fallbackSrc="https://placehold.co/80x80/2e2e2e/ffffff?text=Table"
                                          fallbackClassName="bg-muted"
                                        />
                                      </div>
                                      <span className="text-sm font-medium">{t.id}</span>
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
                                      <span className="glass rounded-full px-2.5 py-1 text-[11px] font-semibold ring-2 ring-white/20 backdrop-blur-sm inline-flex items-center gap-2">
                                        <span>{t.status}</span>
                                      </span>
                                      <span className="glass rounded-full px-2.5 py-1 text-[11px] font-semibold ring-2 ring-white/20 inline-flex items-center gap-1">
                                        <IconDineIn className="w-3.5 h-3.5" />
                                        <span>{t.capacity}</span>
                                      </span>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                            <div className="mt-3 flex items-center gap-3 text-sm">
                              <span className="glass rounded-full px-3 py-1.5 bg-green-500/25 text-green-500 ring-2 ring-white/20 shadow-sm">Available {counts.Available}</span>
                              <span className="glass rounded-full px-3 py-1.5 bg-red-500/25 text-red-500 ring-2 ring-white/20 shadow-sm">Reserved {counts.Reserved}</span>
                              <span className="glass rounded-full px-3 py-1.5 bg-orange-400/25 text-orange-400 ring-2 ring-white/20 shadow-sm">Occupied {counts.Occupied}</span>
                            </div>
                          </>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 glass rounded-3xl overflow-hidden relative border border-white/10"
      >
        <div className="relative">
          <div className="relative aspect-[16/9]">
            <motion.div className="absolute inset-0">
              {!loadedSlides[slideIndex] && <div className="absolute inset-0 skeleton" />}
            </motion.div>
            <motion.div className="absolute inset-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <SafeImage
                      src={slides[slideIndex].src}
                      alt={slides[slideIndex].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1400px"
                      unoptimized
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzY2JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nNjYnIGZpbGw9JyNlZWUnIC8+PC9zdmc+"
                      fallbackSrc="https://placehold.co/1600x900/2e2e2e/ffffff?text=Bistro+Carousel"
                      onLoadingComplete={() =>
                        setLoadedSlides((prev) => {
                          const next = [...prev];
                          next[slideIndex] = true;
                          return next;
                        })
                      }
                      onImageError={() =>
                        setLoadedSlides((prev) => {
                          const next = [...prev];
                          next[slideIndex] = true;
                          return next;
                        })
                      }
                      fallbackClassName="bg-muted"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {slides.map((_, i) => {
                const active = i === slideIndex;
                return (
                  <motion.button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setSlideIndex(i)}
                    whileTap={{ scale: 0.9 }}
                    className={`h-2 w-2 rounded-full ${active ? "bg-primary" : "bg-white/40"}`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                aria-label="Previous"
                onClick={() => setSlideIndex((i) => (i - 1 + slides.length) % slides.length)}
                className="glass rounded-xl p-2"
              >
                <IconArrowRight className="h-4 w-4 rotate-180" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                aria-label="Next"
                onClick={() => setSlideIndex((i) => (i + 1) % slides.length)}
                className="glass rounded-xl p-2"
              >
                <IconArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-6 grid md:grid-cols-3 gap-6">
        {[
          { src: "https://picsum.photos/id/102/1200/900", alt: "Signature dessert" },
          { src: "https://picsum.photos/id/1043/1200/900", alt: "Open kitchen view" },
          { src: "https://picsum.photos/id/106/1200/900", alt: "Dining area" }
        ].map((img, i) => (
          <motion.div key={i} whileHover={{ y: -2, scale: 1.03 }} className="glass rounded-2xl overflow-hidden">
            <div className="relative aspect-[4/3]">
              <SafeImage
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                unoptimized
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzY2JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAnIGhlaWdodD0nNjYnIGZpbGw9JyNlZWUnIC8+PC9zdmc+"
                fallbackSrc="https://placehold.co/1200x900/2e2e2e/ffffff?text=Bistro+Gallery"
                fallbackClassName="bg-muted"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

       {loading ? (
         <div className="mt-6 grid md:grid-cols-2 gap-6">
           <div className="glass rounded-2xl p-5 border border-white/10">
             <div className="h-6 w-40 rounded skeleton" />
             <div className="mt-3 h-24 w-full rounded-xl skeleton" />
           </div>
           <div className="glass rounded-2xl p-5 border border-white/10">
             <div className="h-6 w-40 rounded skeleton" />
             <div className="mt-3 h-24 w-full rounded-xl skeleton" />
           </div>
           <div className="glass rounded-2xl p-5 border border-white/10 md:col-span-2">
             <div className="h-6 w-40 rounded skeleton" />
             <div className="mt-3 h-36 w-full rounded-xl skeleton" />
           </div>
         </div>
       ) : (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
            className="relative glass rounded-2xl p-5 border border-white/10 hover:bg-white/7 hover:ring-1 hover:ring-primary/40 transition-all overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={() =>
              setOpenFlags((prev) => {
                const next = [...prev];
                next[0] = !next[0];
                return next;
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setOpenFlags((prev) => {
                  const next = [...prev];
                  next[0] = !next[0];
                  return next;
                });
            }}
            tabIndex={0}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-2xl"
            />
            <div className="relative z-10">
              <div className="glass rounded-xl p-4 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                    <span className="glass rounded-lg p-2">
                      <IconHome className="w-4 h-4" />
                    </span>
                    <h3 className="font-semibold">Background</h3>
                  </div>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: openFlags[0] ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="glass rounded-lg p-2"
                  >
                    <IconChevronDown className="w-4 h-4" />
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {openFlags[0] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -4 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="space-y-2 text-sm opacity-95">
                        {cardData[0].content.map((t, i) => (
                          <p key={i}>{t}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
           </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="relative glass rounded-2xl p-5 border border-white/10 hover:bg-white/7 hover:ring-1 hover:ring-primary/40 transition-all overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={() =>
              setOpenFlags((prev) => {
                const next = [...prev];
                next[1] = !next[1];
                return next;
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setOpenFlags((prev) => {
                  const next = [...prev];
                  next[1] = !next[1];
                  return next;
                });
            }}
            tabIndex={0}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-400/20 blur-2xl"
            />
            <div className="relative z-10">
              <div className="glass rounded-xl p-4 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                  <span className="glass rounded-lg p-2">
                    <IconList className="w-4 h-4" />
                  </span>
                  <h3 className="font-semibold">Operational Challenges</h3>
                  </div>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: openFlags[1] ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="glass rounded-lg p-2"
                  >
                    <IconChevronDown className="w-4 h-4" />
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {openFlags[1] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -4 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="space-y-2 text-sm opacity-95">
                        {cardData[1].content.map((t, i) => (
                          <p key={i}>{t}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
           </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative glass rounded-2xl p-5 border border-white/10 md:col-span-2 hover:bg-white/7 hover:ring-1 hover:ring-primary/40 transition-all overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={() =>
              setOpenFlags((prev) => {
                const next = [...prev];
                next[2] = !next[2];
                return next;
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setOpenFlags((prev) => {
                  const next = [...prev];
                  next[2] = !next[2];
                  return next;
                });
            }}
            tabIndex={0}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary/25 blur-2xl"
            />
            <div className="relative z-10">
              <div className="glass rounded-xl p-4 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                  <span className="glass rounded-lg p-2">
                    <IconSettings className="w-4 h-4" />
                  </span>
                  <h3 className="font-semibold">Proposed Solution</h3>
                  </div>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: openFlags[2] ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="glass rounded-lg p-2"
                  >
                    <IconChevronDown className="w-4 h-4" />
                  </motion.span>
                </div>
              <AnimatePresence initial={false}>
                {openFlags[2] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -4 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="space-y-2 text-sm opacity-95">
                      {cardData[2].content.map((t, i) => (
                        <p key={i}>{t}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
           </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="relative glass rounded-2xl p-5 border border-white/10 hover:bg-white/7 hover:ring-1 hover:ring-primary/40 transition-all overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={() =>
              setOpenFlags((prev) => {
                const next = [...prev];
                next[3] = !next[3];
                return next;
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setOpenFlags((prev) => {
                  const next = [...prev];
                  next[3] = !next[3];
                  return next;
                });
            }}
            tabIndex={0}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-400/20 blur-2xl"
            />
            <div className="relative z-10">
              <div className="glass rounded-xl p-4 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                  <span className="glass rounded-lg p-2">
                    <IconStar className="w-4 h-4" />
                  </span>
                  <h3 className="font-semibold">Benefits</h3>
                  </div>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: openFlags[3] ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="glass rounded-lg p-2"
                  >
                    <IconChevronDown className="w-4 h-4" />
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {openFlags[3] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -4 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="space-y-2 text-sm opacity-95">
                        {cardData[3].content.map((t, i) => (
                          <p key={i}>{t}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
           </motion.div>

           <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative glass rounded-2xl p-5 border border-white/10 hover:bg-white/7 hover:ring-1 hover:ring-primary/40 transition-all overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={() =>
              setOpenFlags((prev) => {
                const next = [...prev];
                next[4] = !next[4];
                return next;
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setOpenFlags((prev) => {
                  const next = [...prev];
                  next[4] = !next[4];
                  return next;
                });
            }}
            tabIndex={0}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-2xl"
            />
            <div className="relative z-10">
              <div className="glass rounded-xl p-4 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                  <span className="glass rounded-lg p-2">
                    <IconChart className="w-4 h-4" />
                  </span>
                  <h3 className="font-semibold">Management Insights</h3>
                  </div>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: openFlags[4] ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="glass rounded-lg p-2"
                  >
                    <IconChevronDown className="w-4 h-4" />
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {openFlags[4] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -4 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="space-y-2 text-sm opacity-95">
                        {cardData[4].content.map((t, i) => (
                          <p key={i}>{t}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
           </motion.div>

           <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="relative glass rounded-2xl p-5 border border-white/10 md:col-span-2 hover:bg-white/7 hover:ring-1 hover:ring-primary/40 transition-all overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            onClick={() =>
              setOpenFlags((prev) => {
                const next = [...prev];
                next[5] = !next[5];
                return next;
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setOpenFlags((prev) => {
                  const next = [...prev];
                  next[5] = !next[5];
                  return next;
                });
            }}
            tabIndex={0}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-orange-400/20 blur-2xl"
            />
            <div className="relative z-10">
              <div className="glass rounded-xl p-4 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2">
                  <span className="glass rounded-lg p-2">
                    <IconUsers className="w-4 h-4" />
                  </span>
                  <h3 className="font-semibold">Academic Context</h3>
                  </div>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: openFlags[5] ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="glass rounded-lg p-2"
                  >
                    <IconChevronDown className="w-4 h-4" />
                  </motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {openFlags[5] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, y: -4 }}
                      animate={{ height: "auto", opacity: 1, y: 0 }}
                      exit={{ height: 0, opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="space-y-2 text-sm opacity-95">
                        {cardData[5].content.map((t, i) => (
                          <p key={i}>{t}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
           </motion.div>

         </div>
       )}
     </div>
   );
 }
