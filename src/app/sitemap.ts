import { MetadataRoute } from 'next';

// Routes from Ahrefs keyword research
const SEO_ROUTES = [
  // Popular Nairobi routes
  { from: 'cbd', to: 'kangemi' },
  { from: 'cbd', to: 'karen' },
  { from: 'cbd', to: 'rongai' },
  { from: 'cbd', to: 'ngong' },
  { from: 'cbd', to: 'kikuyu' },
  { from: 'cbd', to: 'thika' },

  // Long-distance routes
  { from: 'nairobi', to: 'nakuru' },
  { from: 'nairobi', to: 'naivasha' },
  { from: 'nairobi', to: 'nyeri' },
  { from: 'nairobi', to: 'nyahururu' },
  { from: 'nairobi', to: 'nanyuki' },
  { from: 'nairobi', to: 'narok' },
  { from: 'nairobi', to: 'machakos' },
  { from: 'nakuru', to: 'eldoret' },

  // Coastal routes
  { from: 'mombasa', to: 'kilifi' },

  // Reverse routes
  { from: 'kangemi', to: 'cbd' },
  { from: 'kasarani', to: 'cbd' },
  { from: 'karen', to: 'cbd' },
  { from: 'nakuru', to: 'nairobi' },
  { from: 'kilifi', to: 'mombasa' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Homepage
  const homeEntry: MetadataRoute.Sitemap = [
    {
      url: 'https://nauli.ke',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Route pages
  const routeEntries: MetadataRoute.Sitemap = SEO_ROUTES.map((route) => ({
    url: `https://nauli.ke/${route.from}-to-${route.to}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  return [...homeEntry, ...routeEntries];
}
