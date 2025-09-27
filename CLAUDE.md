# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 dashboard application for PIZZANA CRM that connects to Google Sheets in real-time. The dashboard displays business analytics across three main sections: General metrics, Local B2C operations, and Events B2B operations.

## Essential Commands

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint

# Environment setup
cp .env.local.example .env.local  # Create environment configuration
```

## Architecture Overview

### Data Flow Architecture
1. **Google Sheets API** (`src/lib/googleSheets.ts`) - Central data source with typed interfaces
2. **API Route** (`src/app/api/dashboard/route.ts`) - Server-side data processing and business logic
3. **Client Components** - React components that fetch and display processed data
4. **Real-time Updates** - Manual refresh capability with loading states

### Key Data Structures
The application processes 4 main Google Sheets:
- **PEDIDOS** (Orders) - Pizza orders with emoji-based product selection (🌼⚡🌿🧀🥬🍕🤌🍄🌽)
- **CLIENTES** (Customers) - Customer lifecycle and retention tracking
- **KPIs** - Monthly performance metrics segmented by business type
- **PRODUCTOS** - Pizza menu with pricing and ingredients

### Component Architecture
```
src/
├── app/
│   ├── api/dashboard/route.ts    # Main API endpoint with business logic
│   └── page.tsx                  # Main dashboard page with data fetching
├── components/
│   ├── sections/                 # Three main dashboard sections
│   │   ├── GeneralSection.tsx    # Candlestick charts and overall metrics
│   │   ├── LocalSection.tsx      # B2C metrics with top clients/pizzas
│   │   └── EventsSection.tsx     # B2B metrics and comparatives
│   ├── charts/                   # Recharts implementations
│   │   ├── CandlestickChart.tsx  # Revenue trends with percentage changes
│   │   └── DailyRevenueChart.tsx # Daily revenue line charts
│   ├── ui/                       # Reusable UI components
│   └── layout/                   # Layout and state management components
└── lib/
    └── googleSheets.ts           # Google Sheets integration and data types
```

## Google Sheets Integration

### Required Environment Variables
```env
GOOGLE_SHEETS_PRIVATE_KEY      # Service account private key (with \n line breaks)
GOOGLE_SHEETS_CLIENT_EMAIL     # Service account email
PIZZANA_SPREADSHEET_ID         # Target spreadsheet ID
```

### Data Processing Logic
- **Pizza tracking**: Uses emoji columns (🌼⚡🌿🧀🥬🍕🤌🍄🌽) for product selection
- **Business segmentation**: Filters by `tipo` field ("Local" vs "Evento") - Column X (index 23)
- **Currency parsing**: Removes `$.,` characters and converts to numbers
- **Date filtering**: Current vs previous month comparisons using date-fns
- **Data validation**: Excludes pedidos without valid dates from analytics (logged as "Pedido sin fecha")

## Component Guidelines

### Section Components
Each section (`GeneralSection`, `LocalSection`, `EventsSection`) receives processed data from the API and handles its own visualization. They are designed to be self-contained with their own loading and error states.

### Chart Components
- Use **Recharts** for all visualizations
- **CandlestickChart**: Displays 6-month revenue trends with percentage changes
- **DailyRevenueChart**: Shows revenue by working days only
- Include interactive tooltips with business-relevant information

### Responsive Layout
- **Desktop**: General section full-width, Local and Events side-by-side
- **Tablet**: General section full-width, Local and Events in columns
- **Mobile**: All sections stacked vertically

## Data Calculation Logic

### Revenue Metrics
- Current month vs previous month percentage changes
- Local vs Events revenue distribution with percentages
- Daily revenue only for days with actual transactions

### Client Analysis
- Unique client counting by `nombre_cliente`
- Top 3 clients by total revenue with order count
- Top 3 pizzas by quantity sold with revenue calculation

### Business Intelligence
- Multi-channel revenue tracking (Local, Events, Fair, Others)
- Working days optimization (Friday/Saturday tracking)
- Customer lifecycle status monitoring

## Common Development Patterns

### Error Handling
All data fetching includes try-catch with user-friendly error messages. Components gracefully handle missing or malformed data from Google Sheets.

### Loading States
Use consistent loading patterns across components with the `LoadingSpinner` component for data-heavy operations.

### Currency and Date Formatting
- Currency: Chilean Peso (CLP) format via `formatCurrency()`
- Dates: Chilean locale format via `formatDate()`
- All monetary parsing removes Chilean currency formatting

## Google Sheets Schema Dependencies

The application expects specific column structures in Google Sheets. Key dependencies:

### PEDIDOS Sheet (Columns A-X):
- Pizza columns must use exact emoji characters (🌼⚡🌿🧀🥬🍕🤌🍄🌽) - Columns F-N
- Date formats must be parseable by `parseISO()` or DD/MM/YYYY format - Column B
- Monetary values can include Chilean peso formatting ($, periods, commas)
- Business type classification via `Tipo` column ("Local"/"Evento") - **Column X (index 23)**
- Beneficio calculation in Column W (index 22)

### Data Processing Updates:
- **Fixed column mapping**: `tipo` field now correctly maps to Column X instead of getting monetary values from Column W
- **Enhanced date validation**: Supports both ISO and DD/MM/YYYY formats with fallback handling
- **Improved error logging**: Invalid data entries are logged but don't break the application
- **Currency cleaning**: All monetary fields strip Chilean peso formatting before conversion

When modifying data processing, ensure compatibility with the existing Google Sheets structure used by the PIZZANA business.