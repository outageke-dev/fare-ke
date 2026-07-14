# Nauli Setup Guide

## Database Setup (Prisma + Supabase)

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your database credentials (URL, password)
4. From the SQL Editor, run the following to enable required extensions:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search
```

### 2. Install Prisma

```bash
npm install -D prisma @prisma/client
npx prisma init
```

### 3. Configure Environment

Create a `.env.local` file (copy from `.env.example`):

```bash
DATABASE_URL="postgresql://postgres:PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres?schema=public"
```

Replace:
- `PASSWORD` with your Supabase database password
- `YOUR_PROJECT` with your Supabase project ID

### 4. Create Database

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database schema from `prisma/schema.prisma`
- Generate Prisma client
- Create migration files

### 5. Seed Initial Data

```bash
npm run seed
```

This populates:
- All matatu operators (Super Metro, Metrotrans, etc.)
- Popular routes from Ahrefs keyword research
- Sample fare reports for demonstration

### 6. Generate Prisma Client

```bash
npx prisma generate
```

## Project Structure

```
/src
  /lib
    db.ts              # Prisma singleton
    routes.ts          # Route database operations
    fare-reports.ts    # Fare report operations
  /components
    /ui                # Custom design system components
  /apps
    /components
      FareSearchContent.tsx  # Main app component
```

## Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run seed          # Seed initial data
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate   # Create/run migrations
```

## Database Schema

### Route
- `from`, `to`: Location names
- `slug`: SEO-friendly URL slug
- `currentEstimatedFare`: Real-time estimate
- `lowestTodayFare`, `highestTodayFare`: Range
- `totalReports`: Number of community reports
- `confidence`: Based on report agreement

### FareReport
- `routeId`, `operatorId`: Foreign keys
- `farePaid`: Reported fare amount
- `traffic`, `weather`: Contextual data
- `isOutlier`: Flagged for outlier detection
- `userId`: Optional (for future authentication)

### Operator
- `name`, `slug`: Matatu operator information

### FareTrend
- Historical daily fare data for trends

### Analytics
- Event logging (searches, reports, views)

## Next Steps

1. **Authentication** - Add user signup/login
2. **Route Pages** - Create SEO-friendly pages for each route
3. **Outlier Detection** - Implement statistical outlier filtering
4. **Analytics Dashboard** - Track trends over time
5. **Notifications** - Alert users to significant fare changes
6. **Maps Integration** - Show routes on map
