import "@/styles/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "BISTROFLOW – East Gate Bistro",
    template: "%s | BISTROFLOW"
  },
  description:
    "Integrated Food Order & Reservation Experience – premium, modern, frontend-only showcase of Filipino cuisine, artisanal burgers, pizza, and pasta.",
  keywords: ["Bistroflow", "East Gate Bistro", "Food Delivery", "Restaurant Reservation", "Filipino Cuisine", "Online Ordering"],
  authors: [{ name: "Bistroflow Team" }],
  creator: "Bistroflow Team",
  publisher: "Bistroflow Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/assets/bistroflow-logo.jpg"
  },
  openGraph: {
    title: "BISTROFLOW – East Gate Bistro",
    description:
      "Premium food ordering interface with reservations, gallery and more.",
    url: "https://bistroflow.example.com",
    siteName: "Bistroflow",
    type: "website",
    locale: "en_PH",
    images: [
      {
        url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "East Gate Bistro"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "BISTROFLOW – East Gate Bistro",
    description: "Premium food ordering interface with reservations, gallery and more.",
    images: ["https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "East Gate Bistro",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80&auto=format&fit=crop",
    servesCuisine: ["Filipino", "Burgers", "Pizza", "Pasta", "Desserts"],
    url: "https://bistroflow.example.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 East Gate Ave",
      addressLocality: "Metro City",
      addressRegion: "PH",
      postalCode: "1000"
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "1200" }
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
