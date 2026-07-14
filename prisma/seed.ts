/**
 * Nauli Database Seeding Script
 *
 * This script populates the database with initial routes based on Ahrefs keyword research.
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Routes from Ahrefs keyword research (SEO targets)
const SEED_ROUTES = [
  // Popular Nairobi routes
  { from: 'CBD', to: 'Kangemi' },
  { from: 'CBD', to: 'Karen' },
  { from: 'CBD', to: 'Rongai' },
  { from: 'CBD', to: 'Ngong' },
  { from: 'CBD', to: 'Kikuyu' },
  { from: 'CBD', to: 'Thika' },

  // Long-distance routes (High search volume)
  { from: 'Nairobi', to: 'Nakuru' },
  { from: 'Nairobi', to: 'Naivasha' },
  { from: 'Nairobi', to: 'Nyeri' },
  { from: 'Nairobi', to: 'Nyahururu' },
  { from: 'Nairobi', to: 'Nanyuki' },
  { from: 'Nairobi', to: 'Narok' },
  { from: 'Nairobi', to: 'Machakos' },
  { from: 'Nakuru', to: 'Eldoret' },

  // Coastal routes
  { from: 'Mombasa', to: 'Kilifi' },

  // Reverse routes
  { from: 'Kangemi', to: 'CBD' },
  { from: 'Kasarani', to: 'CBD' },
  { from: 'Karen', to: 'CBD' },
  { from: 'Nakuru', to: 'Nairobi' },
  { from: 'Kilifi', to: 'Mombasa' },
];

// Matatu operators in Kenya
const SEED_OPERATORS = [
  'Super Metro',
  'Metrotrans',
  'Forward Travelers',
  'City Shuttle',
  'KBS',
  '2NK',
  'Coastal',
  'Dar Express',
  'Acsend',
  'Jatco',
  'Scandinavian',
  'Southern Star',
  'Emali',
  'Majani',
  'Mash East',
];

function createRouteSlug(from: string, to: string): string {
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

  return `${slugify(from)}-to-${slugify(to)}`;
}

async function main() {
  console.log('🌱 Starting Nauli database seed...\n');

  try {
    // Create operators
    console.log('📍 Creating operators...');
    for (const operatorName of SEED_OPERATORS) {
      const slug = operatorName.toLowerCase().replace(/\s+/g, '-');
      await prisma.operator.upsert({
        where: { slug },
        update: {},
        create: {
          name: operatorName,
          slug,
        },
      });
    }
    console.log(`✅ Created ${SEED_OPERATORS.length} operators\n`);

    // Create routes
    console.log('🛣️  Creating routes...');
    for (const route of SEED_ROUTES) {
      const slug = createRouteSlug(route.from, route.to);
      await prisma.route.upsert({
        where: { slug },
        update: {},
        create: {
          from: route.from,
          to: route.to,
          slug,
          currentEstimatedFare: 0,
          lowestTodayFare: 0,
          highestTodayFare: 0,
          averageFare: 0,
          confidence: 'low',
        },
      });
    }
    console.log(`✅ Created ${SEED_ROUTES.length} routes\n`);

    // Generate some sample reports for a few routes
    console.log('📊 Generating sample fare reports...');
    const sampleRoutes = [
      { from: 'CBD', to: 'Kangemi', expectedFare: 150 },
      { from: 'Nairobi', to: 'Nakuru', expectedFare: 400 },
      { from: 'Mombasa', to: 'Kilifi', expectedFare: 250 },
    ];

    for (const sampleRoute of sampleRoutes) {
      const route = await prisma.route.findFirst({
        where: {
          from: { equals: sampleRoute.from, mode: 'insensitive' },
          to: { equals: sampleRoute.to, mode: 'insensitive' },
        },
      });

      if (route) {
        // Get 3 random operators
        const operators = await prisma.operator.findMany({
          take: 3,
          orderBy: { id: 'asc' },
        });

        // Create 10 sample reports for each route
        for (let i = 0; i < 10; i++) {
          const operator = operators[i % operators.length];
          const variance = (Math.random() - 0.5) * 40; // ±20 from expected fare

          await prisma.fareReport.create({
            data: {
              routeId: route.id,
              operatorId: operator.id,
              farePaid: Math.round(sampleRoute.expectedFare + variance),
              traffic: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
              weather: Math.random() > 0.8 ? 'rain' : 'sunny',
              isOutlier: false,
            },
          });
        }

        // Update route estimates
        const reports = await prisma.fareReport.findMany({
          where: { routeId: route.id, isOutlier: false },
          select: { farePaid: true },
        });

        const fares = reports.map((r) => r.farePaid).sort((a, b) => a - b);
        const avgFare = fares.reduce((a, b) => a + b, 0) / fares.length;

        await prisma.route.update({
          where: { id: route.id },
          data: {
            currentEstimatedFare: Math.round(avgFare),
            lowestTodayFare: fares[0],
            highestTodayFare: fares[fares.length - 1],
            averageFare: Math.round(avgFare),
            totalReports: reports.length,
            confidence: 'high',
            lastUpdated: new Date(),
          },
        });
      }
    }
    console.log(`✅ Generated sample fare reports\n`);

    console.log('🎉 Database seed complete!\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
