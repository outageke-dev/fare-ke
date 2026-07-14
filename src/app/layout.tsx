import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import '../styles/tailwind.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'Nauli — Real-Time Matatu Fares in Kenya',
  description:
    'Find out how much you\'ll actually pay for a matatu ride RIGHT NOW. Real-time fare estimates based on community reports. Fast, simple, accurate.',
  keywords: [
    'matatu fares',
    'Kenya fares',
    'matatu prices',
    'transport costs',
    'Nairobi transport',
    'Kenya public transport',
    'fare rates',
  ],
  authors: [{ name: 'Nauli' }],
  creator: 'Nauli',
  publisher: 'Nauli',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://nauli.ke',
    siteName: 'Nauli',
    title: 'Nauli — Real-Time Matatu Fares in Kenya',
    description:
      'Find out how much you\'ll actually pay for a matatu ride RIGHT NOW. Real-time fare estimates based on community reports.',
    images: [
      {
        url: 'https://nauli.ke/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nauli - Real-time matatu fares',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nauli — Real-Time Matatu Fares in Kenya',
    description:
      'Find out how much you\'ll actually pay for a matatu ride RIGHT NOW.',
    images: ['https://nauli.ke/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Nauli',
  description: 'Real-time matatu fare estimates in Kenya based on community reports',
  url: 'https://nauli.ke',
  applicationCategory: 'TransportationApplication',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'KES',
    priceRange: '50-500',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://nauli.ke?from={from}&to={to}',
    },
    query: 'required name=from,to',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
