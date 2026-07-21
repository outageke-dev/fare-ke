import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FareRouteDetail from '@/components/routes/FareRouteDetail';

interface RoutePageProps {
  params: Promise<{
    route: string;
  }>;
}

function decodeRouteName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function parseRouteSlug(route: string): { from: string; to: string } | null {
  if (!route) return null;

  const parts = route.split('-to-');
  if (parts.length !== 2) return null;

  const [from, to] = parts;
  if (!from || !to) return null;

  return { from, to };
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const route = resolvedParams?.route;
  const parsed = route ? parseRouteSlug(route) : null;

  if (!parsed) {
    return {
      title: 'Matatu Fare | Nauli',
      description: 'Real-time matatu fares in Kenya',
    };
  }

  const { from, to } = parsed;
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
      url: `https://nauli.ke/${route}`,
    },
    twitter: {
      card: 'summary',
      title: `Fare: ${fromName} → ${toName}`,
      description: `Real-time matatu fares. Updated minutes ago.`,
    },
  };
}

export async function generateStaticParams(): Promise<Array<{ route: string }>> {
  return [{ route: 'cbd-to-kangemi' }, { route: 'cbd-to-karen' }, { route: 'cbd-to-kasarani' }];
}

export default async function RouteDetailPage({ params }: RoutePageProps) {
  const { route } = await params;
  const parsed = parseRouteSlug(route);

  if (!parsed) {
    notFound();
  }

  const { from, to } = parsed;
  const fromName = decodeRouteName(from);
  const toName = decodeRouteName(to);

  return (
    <div className="max-w-2xl mx-auto py-8 px-6">
      <h1>{fromName} to {toName}</h1>
      <p>Route page is working!</p>
      <FareRouteDetail from={fromName} to={toName} />
    </div>
  );
}
