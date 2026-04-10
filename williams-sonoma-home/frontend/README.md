# Williams Sonoma Home Frontend

Modern React + TypeScript e-commerce platform frontend with luxury branding and AI-powered insights.

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env.local` file:

```
VITE_API_URL=http://localhost:5000/api
```

## Features

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **TypeScript** - Full type safety
- **Authentication** - Role-based access (Customer, Manufacturer, Admin)
- **Product Catalog** - Search, filter, and browse with AI tags
- **AI Insights** - Buyer recommendations and product analysis
- **Order Management** - Track orders and returns
- **Dashboards** - Manufacturer and admin analytics
- **Charts & Analytics** - Recharts for data visualization

## Architecture

```
src/
├── components/     # Reusable React components
├── pages/         # Page components
├── context/       # Zustand stores for state management
├── hooks/         # Custom React hooks
├── services/      # API service layer
├── types/         # TypeScript types
└── styles/        # Global styles
```

## Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Styling

- Tailwind CSS for utility classes
- Custom CSS in `src/styles/globals.css`
- Brand colors: Primary #1A1A1A, Secondary #8B7355, Accent #C4A882
- Serif fonts: Cormorant Garamond
- Sans fonts: Inter
