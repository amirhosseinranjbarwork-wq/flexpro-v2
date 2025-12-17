# Project Structure Reference Guide

## Quick Navigation

### 📦 Root Level
```
flexpro-v2/
├── README.md                    # Start here - main project documentation
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── .env / .env.local           # Environment variables (DO NOT COMMIT)
└── eslint.config.js             # Code quality rules
```

### 📚 Documentation (`docs/`)
All project documentation, guides, and setup files are organized here.
**Common files:**
- PROJECT_CLEANUP_SUMMARY.md - This cleanup's details
- QUICK_START_GUIDE.md - Getting started
- ARCHITECTURE.md - System design
- DATABASE_FIXES_GUIDE.md - Database help

### 🛠️ Scripts (`scripts/`)
All utility scripts, database migrations, and setup tools.
**Categories:**
- `*.bat` / `*.ps1` - Windows automation scripts
- `*.js` - Node.js database and migration scripts
- `*.sql` - SQL migration files
- `*.py` - Python utility scripts

**Common tasks:**
```bash
# Run database setup
node scripts/setup-database.js

# Apply migrations
node scripts/apply-sql-migrations.js

# Check database status
node scripts/check-database-status.js
```

### 💻 Frontend Source (`src/`)

#### Components (`src/components/`)
```
src/components/
├── ui/                          # Generic, reusable UI components
│   ├── Modal.tsx
│   ├── Badge.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── ... (other UI primitives)
│
├── chat/                         # Chat feature components
├── gallery/                      # Gallery feature components
├── workout/                      # Workout feature components
├── TrainingPanel/                # Training feature components
│
└── *.tsx                         # Feature-specific components
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── AuthModal.tsx
    └── ...
```

#### Data (`src/data/`)
```
src/data/
├── exercises.ts                 # Active - used in app
├── foods.ts                     # Active - fallback data
├── supplements.ts               # Active - fallback data
├── supplementsComplete.ts       # Active - supplements reference
├── supplementsData.ts           # Active - supplements data
│
└── legacy/                      # Archived - not used
    ├── cardioExercises.ts
    ├── correctiveExercises.ts
    ├── warmupCooldown.ts
    ├── nasmPrograms.ts
    └── ... (other unused data)
```

#### Other Directories
```
src/
├── context/                     # React Context providers (AppContext, DataContext)
├── hooks/                       # Custom React hooks
├── pages/                       # Page components (Dashboard, Admin, etc.)
├── types/                       # TypeScript type definitions
├── utils/                       # Utility functions
├── lib/                         # External library integrations (Supabase client)
├── assets/                      # Images, icons, fonts
└── test/                        # Test files
```

### 🗄️ Database (`supabase/`)
```
supabase/
├── config.toml                  # Supabase local configuration
├── functions/                   # Supabase edge functions
└── migrations/                  # Database schema migrations
```

### 🐍 Backend (`flexpro-ai-service/`)
```
flexpro-ai-service/
├── Dockerfile                   # Docker image definition
├── docker-compose.yml           # Docker compose configuration
├── requirements.txt             # Python dependencies
│
└── app/
    ├── main.py                 # FastAPI application entry
    ├── __init__.py
    ├── api/                    # API endpoints
    ├── core/                   # Core utilities
    ├── db/                     # Database models
    ├── models/                 # Pydantic models
    └── services/               # Business logic
```

---

## Common Tasks

### 🔍 Finding Files
- **UI Components:** `src/components/ui/`
- **Feature Logic:** `src/hooks/`
- **Setup Scripts:** `scripts/`
- **Documentation:** `docs/`
- **Database Configs:** `supabase/`

### 📝 Adding New Features
1. Create feature folder in `src/components/` if needed
2. Place specific logic in `src/hooks/` or `src/utils/`
3. Use `src/components/ui/` for UI building blocks
4. Update types in `src/types/`

### 🔧 Database Work
1. Create migration in `supabase/migrations/`
2. Add setup script in `scripts/` if needed
3. Update types in `src/types/database.ts`
4. Use Supabase client from `src/lib/supabaseClient.ts`

### 📦 Building & Running
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run with Docker
docker-compose up -d
```

---

## Import Examples

### ✅ Correct Imports
```typescript
// UI Components
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

// Feature components
import Header from '../components/Header';
import TrainingPanel from '../components/TrainingPanel';

// Data (active only)
import { exercises } from '../data/exercises';

// Custom hooks
import { useData } from '../hooks/useData';

// Utilities
import { supabase } from '../lib/supabaseClient';
```

### ❌ Avoid
```typescript
// DON'T import from legacy
import { cardioExercises } from '../data/legacy/cardioExercises';  // ❌

// DON'T import directly instead of using barrel export
import { AnimatedCounter } from '../components/ui/AnimatedCounter';  // Use index export instead
```

---

## Git Workflow

```bash
# After changes
git status
git add .
git commit -m "feat: add new feature"
git push

# See structure changes
git log --name-status
```

---

## Support

- **Questions about structure?** See `/docs/ARCHITECTURE.md`
- **Setup help?** Check `/docs/QUICK_START_GUIDE.md`
- **Database issues?** Read `/docs/DATABASE_FIXES_GUIDE.md`
- **Migration problems?** Use `scripts/` utilities

---

**Last Updated:** December 17, 2025
