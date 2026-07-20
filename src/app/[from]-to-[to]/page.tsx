import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FareRouteDetail from '@/components/routes/FareRouteDetail';

interface RoutePageProps {
  params: Promise<{
    from: string;
    to: string;
  }>;
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
  const resolvedParams = await params;

  if (!resolvedParams?.from || !resolvedParams?.to) {
    return {
      title: 'Matatu Fare | Nauli',
      description: 'Real-time matatu fares in Kenya',
    };
  }

  const { from, to } = resolvedParams;
  const fromName = decodeRouteName(from);
  const toName = decodeRouteName(to);

  return {
    title: `Matatu Fare: ${fromName} to ${toName} | Nauli`,
    description: `Real-time matatu fares from ${fromName} to ${toName}. Check current estimates, recent reports, and fare trends in Kenya.`,
    keywords: [
      `${fromName} to ${toName} matatu fare`,
      `${fromName} to ${toName} fare`,
      'matatu price',
      'Kenya transport',
    ],
    openGraph: {
      title: `Matatu Fare: ${fromName} to ${toName}`,
      description: `Check real-time matatu fares from ${fromName} to ${toName}. Based on community reports.`,
      type: 'website',
      url: `https://nauli.ke/${from}-to-${to}`,
    },
    twitter: {
      card: 'summary',
      title: `Fare: ${fromName} → ${toName}`,
      description: `Real-time matatu fares. Updated minutes ago.`,
    },
  };
}

// Generate static pages for popular routes
export async function generateStaticParams(): Promise<
  Array<{ from: string; to: string }>
> {
  // Popular routes from Ahrefs keywords
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

  return popularRoutes;
}

export default async function RouteDetailPage({ params }: RoutePageProps) {
  const { from, to } = await params;

  if (!from || !to) {
    notFound();
  }

  const fromName = decodeRouteName(from);
  const toName = decodeRouteName(to);

  return <FareRouteDetail from={fromName} to={toName} />;
}
