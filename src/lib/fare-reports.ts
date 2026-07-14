import prisma from './db';
import { getOrCreateRoute, updateRouteEstimates } from './routes';

export interface CreateFareReportInput {
  from: string;
  to: string;
  operatorName: string;
  farePaid: number;
  traffic?: string;
  weather?: string;
  notes?: string;
  userId?: string;
}

export interface FareReportWithOperator {
  id: string;
  farePaid: number;
  traffic?: string;
  weather?: string;
  operator: {
    name: string;
  };
  createdAt: Date;
}

/**
 * Get or create an operator
 */
async function getOrCreateOperator(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  let operator = await prisma.operator.findUnique({
    where: { slug },
  });

  if (!operator) {
    operator = await prisma.operator.create({
      data: { name, slug },
    });
  }

  return operator;
}

/**
 * Submit a fare report
 */
export async function createFareReport(input: CreateFareReportInput) {
  const { from, to, operatorName, farePaid, traffic, weather, notes, userId } =
    input;

  // Get or create route
  const route = await getOrCreateRoute(from, to);

  // Get or create operator
  const operator = await getOrCreateOperator(operatorName);

  // Create the report
  const report = await prisma.fareReport.create({
    data: {
      routeId: route.id,
      operatorId: operator.id,
      userId,
      farePaid,
      traffic,
      weather,
      notes,
      isOutlier: false, // TODO: Implement outlier detection
    },
    include: {
      operator: {
        select: { name: true },
      },
    },
  });

  // Update route estimates
  await updateRouteEstimates(route.id);

  // Log analytics
  await prisma.analytics.create({
    data: {
      event: 'report',
      routeId: route.id,
      userId,
    },
  });

  return report;
}

/**
 * Get recent reports for a route
 */
export async function getRecentReports(
  from: string,
  to: string,
  limit = 5
): Promise<FareReportWithOperator[]> {
  const route = await prisma.route.findFirst({
    where: {
      from: { equals: from, mode: 'insensitive' },
      to: { equals: to, mode: 'insensitive' },
    },
  });

  if (!route) return [];

  return prisma.fareReport.findMany({
    where: {
      routeId: route.id,
      isOutlier: false,
    },
    include: {
      operator: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  }) as Promise<FareReportWithOperator[]>;
}

/**
 * Get reports for today
 */
export async function getRecentReportsSince(
  routeId: string,
  hoursAgo = 24
): Promise<FareReportWithOperator[]> {
  const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

  return prisma.fareReport.findMany({
    where: {
      routeId,
      createdAt: { gte: since },
      isOutlier: false,
    },
    include: {
      operator: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  }) as Promise<FareReportWithOperator[]>;
}
