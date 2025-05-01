import "@/globals.css";
import Providers from "@/providers/provider";
import { LazyMotion, domAnimation } from "framer-motion";
import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import type { ToasterProps } from "sonner";
import QueryClientProvider, { useOnlineStatus } from "../providers/QueryClientProvider"; // Import useOnlineStatus
import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import { useEffect, useState } from "react"; // Import useEffect and useState

const siteUrl = "https://admin.gymnavigator.in";
// export const dynamic = "force-static";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GymNavigator - Gym Management System",
  description:
    "Transform your gym management with GymNavigator. The all-in-one solution for modern gym owners and trainers.",
  applicationName: "GymNavigator",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "LCLleK9nzppdl_Pl1l1Sd00aXJRgLyfl6Xjc6poUDAI"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  appLinks: {
    web: {
      url: siteUrl,
      should_fallback: true,
    },
  },
  openGraph: {
    title: "GymNavigator - Gym Management System",
    description:
      "Transform your gym management with GymNavigator. The all-in-one solution for modern gym owners and trainers.",
    url: siteUrl,
    siteName: "GymNavigator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/gymnavigator-og.jpg", // Direct path to OG image in public directory
        width: 1200,
        height: 630,
        alt: "GymNavigator - Modern Gym Management",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GymNavigator - Gym Management System",
    description:
      "Transform your gym management with GymNavigator. The all-in-one solution for modern gym owners and trainers.",
    images: ["/gymnavigator-og.jpg"],
  },
  other: {
    "og:image:secure_url": `${siteUrl}/gymnavigator-og.jpg`,
    "theme-color": "#1e40af",
    "msapplication-TileColor": "#1e40af",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon/safari-pinned-tab.svg",
        color: "#1e40af",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Define the OfflineIndicator component directly within the layout
  const OfflineIndicator = () => {
    const isOnline = useOnlineStatus();
    const [showIndicator, setShowIndicator] = useState(!isOnline);

    // Use useEffect to manage the visibility with a slight delay to avoid flicker
    useEffect(() => {
      if (!isOnline) {
        setShowIndicator(true);
      } else {
        // Optionally hide immediately or after a delay when back online
        const timer = setTimeout(() => setShowIndicator(false), 2000); // Hide after 2 seconds
        return () => clearTimeout(timer);
      }
    }, [isOnline]);

    if (!showIndicator) {
      return null;
    }

    return (
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 15px',
          borderRadius: '5px',
          zIndex: 10000, // Ensure it's on top
          fontSize: '0.9rem',
        }}
      >
        You are currently offline. Some features may be limited.
      </div>
    );
  };


  const toasterProps: ToasterProps = {
    richColors: true,
    theme: "light",
    position: "top-right",
  };

  return (
    <html lang="en">
      <head />
      <body>
        <Providers>
          <QueryClientProvider>
            <OfflineIndicator /> {/* Add the indicator here */}
            <LazyMotion features={domAnimation}>
              {children}
              <RegisterServiceWorker />
              <Toaster {...toasterProps} />
            </LazyMotion>
          </QueryClientProvider>
        </Providers>
      </body>
    </html>
  );
}
