# PropPulse AI

**PropPulse AI** is a unified **Real Estate CRM, Project & Property Inventory, and Commercial Market Intelligence (GIS)** SaaS platform built with Next.js (App Router), TypeScript, Tailwind CSS, Leaflet (OpenStreetMap), and Supabase.

## Key Modules
- **Dashboard**: Employee & date-range filters, Lead/Opportunity classification, Win/Loss rate, Top Opportunity Corridors, and Expansion Signals.
- **Real Estate CRM**: Leads, Opportunity Pipeline (with mandatory Lost Reason), Projects (RERA, amenities, commission, bank details), Properties/Inventory (Sale/Rent/Lease), Customers & Deals, and Master Data Settings.
- **Market Intelligence (GIS)**: Interactive OpenStreetMap GIS Map, Brand Directory & 4-Quadrant AI SWOT, Competitor Proximity Radar (500m / 1km), Whitespace Opportunity Finder (0–100 score), Expansion Tracker & Commercial Leasing Radar, News & Discovery Inbox, Watchlists, Smart Search, and CSV/JSON Reports.

## Local Development
```bash
npm install
npm run dev
```

## Connecting Supabase & Deploying on Vercel
1. **Create a Supabase Project** and run [`supabase/schema.sql`](./supabase/schema.sql) in the **Supabase SQL Editor**.
2. **Push this repository to GitHub**.
3. **Import into Vercel** and add the following Environment Variables (see `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy** — Vercel will build and serve PropPulse AI automatically. Without Supabase env vars, the app runs seamlessly in Local Demo Mode using `localStorage`.
