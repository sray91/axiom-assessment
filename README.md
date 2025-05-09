# Smart Manufacturing Assessment Tool

A self-service assessment tool for manufacturers to evaluate their Industry 4.0 readiness, identify improvement opportunities, and generate a personalized technology roadmap with ROI projections.

## Features

- Multi-step wizard-based assessment
- Business priority ranking with drag-and-drop interface
- Digital readiness evaluation across key manufacturing pillars
- Optional financial inputs for ROI calculations
- Personalized 3-year technology roadmap
- ROI projection with estimated payback period
- Admin panel for managing benchmarks and technology data

## Tech Stack

- **Next.js 14** with App Router
- **TailwindCSS** for styling
- **Supabase** (PostgreSQL) for authentication and data storage
- **Framer Motion** for animations
- **DND Kit** for drag-and-drop functionality

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd axiom-assess-tool
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Run the database migrations:
   - Copy the contents of `supabase/migrations/initial_schema.sql` and execute it in the Supabase SQL editor
   - Alternatively, use Supabase CLI to run migrations if you have it installed

4. Seed the database:
   - Copy the contents of `supabase/seed.sql` and execute it in the Supabase SQL editor

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js app router
  - `/assessment` - Assessment wizard
  - `/assessment/result/[id]` - Results page
  - `/admin/benchmarks` - Admin interface
- `/lib` - Shared utilities and business logic
  - `supabase.js` - Supabase client and database functions
  - `roi.js` - ROI calculation engine
- `/supabase` - Database migrations and seed data

## License

[MIT](LICENSE)
