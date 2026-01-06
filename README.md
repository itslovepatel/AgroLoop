# AgriLoop India - Agri-Waste-to-Value Marketplace

A production-ready, India-focused marketplace for trading agricultural crop residue as a structured commodity.

## 🌾 Overview

AgriLoop connects farmers with industrial buyers (bioenergy plants, packaging companies, biogas producers) to monetize crop residue instead of burning it, reducing air pollution and generating carbon credits.

## 🚀 Live Deployment

- **Frontend**: [Vercel] (Connect your repo)
- **Backend**: [Supabase](https://supabase.com) (PostgreSQL + Auth)

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind-inspired custom CSS |
| Maps | Leaflet + React-Leaflet |
| Charts | Recharts |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth (Email) |
| Hosting | Vercel |

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your Supabase credentials

# Run development server
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📊 Database Setup

Run the schema in Supabase SQL Editor:

```bash
supabase/schema.sql
```

This creates:
- `profiles` - User data with roles (farmer/buyer/admin)
- `listings` - Crop residue listings
- `bids` - Buyer bids on listings
- `contracts` - Finalized deals
- `forward_contracts` - Bulk demand orders
- `pickup_tracking` - Logistics status

## 🚢 Deployment to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Configure:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy!

## 👤 User Roles

| Role | Access |
|------|--------|
| **Farmer** | List residue, accept bids, track pickups, view earnings |
| **Buyer** | Browse supply, place bids, create contracts, ESG metrics |
| **Admin** | Manage users, override deals, platform settings |

## 📁 Project Structure

```
├── components/       # Reusable UI components
│   ├── ui/          # Badge, Modal, etc.
│   ├── AuthModal.tsx
│   ├── Navbar.tsx
│   └── ...
├── pages/           # Route pages
│   ├── Marketplace.tsx
│   ├── FarmerDashboard.tsx
│   ├── BuyerDashboard.tsx
│   └── AdminDashboard.tsx
├── lib/             # Supabase client
│   ├── supabase.ts
│   └── database.types.ts
├── context/         # React Context (AppContext)
├── supabase/        # Database schema
└── types.ts         # TypeScript interfaces
```

## 📜 License

MIT
