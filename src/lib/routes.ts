import prisma from './db';

export interface RouteSearchResult {
  id: string;
  from: string;
  to: string;
  slug: string;
  currentEstimatedFare: number;
  lowestTodayFare: number;
  highestTodayFare: number;
  averageFare: number;
  totalReports: number;
  confidence: string;
  lastUpdated: Date;
}

/**
 * Create a URL-friendly slug from route
 */
export function createRouteSlug(from: string, to: string): string {
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

  return `${slugify(from)}-to-${slugify(to)}`;
}

/**
 * Get or create a route
 */
export async function getOrCreateRoute(from: string, to: string) {
  const slug = createRouteSlug(from, to);

  let route = await prisma.route.findUnique({
    where: { slug },
  });

  if (!route) {
    route = await prisma.route.create({
      data: {
        from,
        to,
        slug,
        currentEstimatedFare: 0,
        lowestTodayFare: 0,
        highestTodayFare: 0,
        averageFare: 0,
      },
    });
  }

  return route;
}

/**
 * Search routes by from/to locations
 */
export async function searchRoutes(
  from: string,
  to: string
): Promise<RouteSearchResult | null> {
  const route = await prisma.route.findFirst({
    where: {
      from: { equals: from, mode: 'insensitive' },
      to: { equals: to, mode: 'insensitive' },
    },
  });

  return route as RouteSearchResult | null;
}

/**
 * Get popular routes based on report count
 */
export async function getPopularRoutes(limit = 10) {
  return prisma.route.findMany({
    take: limit,
    orderBy: {
      totalReports: 'desc',
    },
  });
}

/**
 * Get all unique routes for SEO sitemap
 */
export async function getAllRoutes() {
  return prisma.route.findMany({
    select: {
      slug: true,
      lastUpdated: true,
    },
    orderBy: {
      totalReports: 'desc',
    },
  });
}

/**
 * Update route fare estimates after new report
 */
export async function updateRouteEstimates(routeId: string) {
  const reports = await prisma.fareReport.findMany({
    where: { routeId },
    select: { farePaid: true, isOutlier: true },
  });

  if (reports.length === 0) return;

  // Filter out outliers
  const validReports = reports.filter((r) => !r.isOutlier);
  if (validReports.length === 0) return;

  const fares = validReports.map((r) => r.farePaid).sort((a, b) => a - b);

  const avgFare = fares.reduce((a, b) => a + b, 0) / fares.length;
  const lowestFare = fares[0];
  const highestFare = fares[fares.length - 1];

  // Calculate confidence based on agreement
  const deviation = highestFare - lowestFare;
  const confidence =
    deviation < avgFare * 0.2
      ? 'high'
      : deviation < avgFare * 0.5
        ? 'medium'
        : 'low';

  await prisma.route.update({
    where: { id: routeId },
    data: {
      currentEstimatedFare: Math.round(avgFare),
      lowestTodayFare: lowestFare,
      highestTodayFare: highestFare,
      averageFare: Math.round(avgFare),
      totalReports: validReports.length,
      confidence,
      lastUpdated: new Date(),
    },
  });
}
