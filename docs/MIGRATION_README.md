# FlexPro v2 Database Migration Guide

## Overview

This migration moves FlexPro v2 from static data files to a Supabase-powered database infrastructure, enabling dynamic updates, advanced search capabilities, and offline-first functionality.

## Prerequisites

- Node.js 18+
- Supabase account and project
- Environment variables configured (see `.env.local`)

## Step 1: Database Setup

### Run the SQL Migration

Execute the `supabase_migration.sql` file in your Supabase SQL editor:

```sql
-- Copy and paste the entire contents of supabase_migration.sql
-- This will create all tables, indexes, functions, and policies
```

### Verify Tables Created

After running the migration, verify these tables exist:
- `foods` - Food database with categories
- `exercises` - Exercise database with muscle groups
- `sync_metadata` - Offline sync tracking

## Step 2: Data Migration

### Install Dependencies

```bash
npm install
```

### Run Migration Script

```bash
npm run migrate
```

This script will:
1. Read static data from `src/data/foodData.ts` and `src/data/resistanceExercises.ts`
2. Transform nested objects into flat database records
3. Insert data into Supabase tables
4. Verify migration success

### Expected Results

- **Foods**: ~50-100 food items across categories
- **Exercises**: ~100-200 exercises across muscle groups

## Step 3: Application Updates

The application now uses these new features:

### Search Hooks

```tsx
import { useFoodSearch, useExerciseSearch } from '../hooks';

// Food search with debouncing
const { search, results, loading } = useFoodSearch();
await search({ query: 'apple', category: 'fruits' });

// Exercise search with filters
const { search, results, loading } = useExerciseSearch();
await search({ query: 'bench press', muscleGroup: 'chest' });
```

### Offline Sync

```tsx
import { useSync } from '../hooks';

const { isOnline, isSyncing, syncNow, pendingChanges } = useSync();
// Automatically syncs when online
```

### Database Operations

```tsx
import { searchFoods, getAllExercises } from '../lib/database';

// Direct database access
const foods = await searchFoods('protein');
const exercises = await getAllExercises();
```

## Step 4: Security & RLS

### Policies Applied

- **Foods & Exercises**: Read-only for authenticated users
- **User Data**: Coaches can only access their clients
- **Sync Data**: Users can only access their sync metadata

### Sanitization

```tsx
import { sanitizeText, sanitizeHtml } from '../utils/sanitization';

const safeText = sanitizeText(userInput);
const safeHtml = sanitizeHtml(htmlContent);
```

## Architecture Benefits

### ✅ Performance
- Full-text search with trigram indexes
- Debounced search to reduce API calls
- Paginated results for large datasets

### ✅ Offline-First
- Local caching with sync on reconnect
- Conflict resolution with Last-Write-Wins
- Network-aware sync operations

### ✅ Security
- Row Level Security on all tables
- Input sanitization against XSS
- Service-role only for data modifications

### ✅ Scalability
- Dynamic data updates without redeployment
- Efficient search across thousands of items
- Modular architecture for future expansion

## Troubleshooting

### Migration Fails
- Check Supabase connection and permissions
- Verify environment variables
- Ensure tables don't already exist with conflicting data

### Search Not Working
- Verify trigram extension is enabled
- Check RPC function permissions
- Confirm data was migrated successfully

### Sync Issues
- Check localStorage for sync metadata
- Verify network connectivity
- Review browser console for sync errors

## Next Steps

1. **Test thoroughly** in development environment
2. **Deploy to staging** for user acceptance testing
3. **Monitor performance** after production deployment
4. **Consider optimizations** based on usage patterns

## Rollback Plan

If migration fails:
1. Keep static files as fallback
2. Use feature flags to switch between implementations
3. Ensure backward compatibility during transition

---

**Migration completed successfully! 🚀**