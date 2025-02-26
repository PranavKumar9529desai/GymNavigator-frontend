import './globals.css';
import RecoilContextProvider from '@/lib/RecoilContextProvider';
import { Analytics } from '@vercel/analytics/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import type { ToasterProps } from 'sonner';
import QueryClientProvider from './providers/QueryClientProvider';
import Providers from './providers/provider';
const siteUrl = 'https://admin.gymnavigator.in';

export const metadata: Metadata = {
  title: 'GymNavigator - Gym Management System',
  description:
    'Transform your gym management with GymNavigator. The all-in-one solution for modern gym owners and trainers.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GymNavigator - Gym Management System',
    description:
      'Transform your gym management with GymNavigator. The all-in-one solution for modern gym owners and trainers.',
    url: siteUrl,
    siteName: 'GymNavigator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/gymnavigator-og.jpg', // Direct path to OG image in public directory
        width: 1200,
        height: 630,
        alt: 'GymNavigator - Modern Gym Management',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GymNavigator - Gym Management System',
    description:
      'Transform your gym management with GymNavigator. The all-in-one solution for modern gym owners and trainers.',
    images: ['/gymnavigator-og.jpg'],
  },
  other: {
    'og:image:secure_url': `${siteUrl}/gymnavigator-og.jpg`,
    'theme-color': '#1e40af',
    'msapplication-TileColor': '#1e40af',
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon/safari-pinned-tab.svg',
        color: '#1e40af',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const toasterProps: ToasterProps = {
    richColors: true,
    theme: 'light',
    position: 'top-right',
  };

  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="LCLleK9nzppdl_Pl1l1Sd00aXJRgLyfl6Xjc6poUDAI"
        />
      </head>
      <body>
        <Providers>
          <QueryClientProvider>
            <RecoilContextProvider>
              <LazyMotion features={domAnimation}>
                {children}
                <Toaster {...toasterProps} />
                <Analytics />
              </LazyMotion>
            </RecoilContextProvider>
          </QueryClientProvider>
        </Providers>
      </body>
    </html>
  );
}
