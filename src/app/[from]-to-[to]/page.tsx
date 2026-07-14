import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FareRouteDetail from '@/components/routes/FareRouteDetail';

interface RoutePageProps {
  params: {
    from: string;
    to: string;
  };
}

// Decode URL slug back to location names
function decodeRouteName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({
  params,
}: RoutePageProps): Promise<Metadata> {
  const from = decodeRouteName(params.from);
  const to = decodeRouteName(params.to);

  return {
    title: `Matatu Fare: ${from} to ${to} | Nauli`,
    description: `Real-time matatu fares from ${from} to ${to}. Check current estimates, recent reports, and fare trends in Kenya.`,
    keywords: [
      `${from} to ${to} matatu fare`,
      `${from} to ${to} fare`,
      'matatu price',
      'Kenya transport',
    ],
    openGraph: {
      title: `Matatu Fare: ${from} to ${to}`,
      description: `Check real-time matatu fares from ${from} to ${to}. Based on community reports.`,
      type: 'website',
      url: `https://nauli.ke/${params.from}-to-${params.to}`,
    },
    twitter: {
      card: 'summary',
      title: `Fare: ${from} → ${to}`,
      description: `Real-time matatu fares. Updated minutes ago.`,
    },
  };
}

// Generate static pages for popular routes
export async function generateStaticParams() {
  // Import the route list from database operations
  // For now, return the most popular routes
  const popularRoutes = [
    { from: 'cbd', to: 'kangemi' },
    { from: 'cbd', to: 'karen' },
    { from: 'cbd', to: 'kasarani' },
    { from: 'nairobi', to: 'nakuru' },
    { from: 'nairobi', to: 'naivasha' },
    { from: 'nairobi', to: 'nyeri' },
    { from: 'mombasa', to: 'kilifi' },
    { from: 'nakuru', to: 'eldoret' },
  ];

  return popularRoutes.map((route) => ({
    from: route.from,
    to: route.to,
  }));
}

export default function RouteDetailPage({ params }: RoutePageProps) {
  const from = decodeRouteName(params.from);
  const to = decodeRouteName(params.to);

  return <FareRouteDetail from={from} to={to} />;
}
