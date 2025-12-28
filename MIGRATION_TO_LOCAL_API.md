# 🚀 Migration to Local API - Complete Guide

## ✅ What Changed

FlexPro V2 has been **completely migrated** from Supabase to a **100% Local SQLite + FastAPI** architecture.

### Removed (Phase 1: The Purge)
- ❌ `flexpro-ai-service/app/db/supabase.py`
- ❌ `src/lib/supabaseClient.ts`
- ❌ `src/lib/supabaseApi.ts`
- ❌ `supabase` dependency from `requirements.txt`

### Added (Phase 2-5: The Build)
- ✅ `flexpro-ai-service/app/db/seed.py` - Rich data seeding (20+ exercises, 12+ foods, 8+ supplements)
- ✅ `src/services/api.ts` - Complete API service layer
- ✅ `src/hooks/useAuth.ts` - Authentication hook
- ✅ `src/hooks/useFoods.ts` - Foods hook with API
- ✅ `src/hooks/useSupplements.ts` - Supplements hook with API
- ✅ `src/store/workoutStore.ts` - Updated with `saveProgram()`, `loadProgram()`, `loadAllPrograms()`

---

## 🏃 Quick Start

### 1. Backend Setup

```bash
cd flexpro-ai-service

# Install dependencies
pip install -r requirements.txt

# Seed the database
python -m app.db.seed

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Seeding 20 exercises...
INFO:     ✓ Seeded 20 exercises
INFO:     Seeding 12 foods...
INFO:     ✓ Seeded 12 foods
INFO:     Seeding 8 supplements...
INFO:     ✓ Seeded 8 supplements
INFO:     ✓ Database seeding completed successfully!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/register` - Register new user
- `GET /api/v1/auth/me` - Get current user

### Exercises
- `GET /api/v1/exercises` - Get all exercises (with filters)
- `GET /api/v1/exercises/{id}` - Get exercise by ID
- `POST /api/v1/exercises` - Create exercise
- `PUT /api/v1/exercises/{id}` - Update exercise
- `DELETE /api/v1/exercises/{id}` - Delete exercise

### Foods
- `GET /api/v1/foods` - Get all foods
- `GET /api/v1/foods/{id}` - Get food by ID
- `POST /api/v1/foods` - Create food
- `PUT /api/v1/foods/{id}` - Update food
- `DELETE /api/v1/foods/{id}` - Delete food

### Supplements
- `GET /api/v1/supplements` - Get all supplements
- `GET /api/v1/supplements/{id}` - Get supplement by ID
- `POST /api/v1/supplements` - Create supplement
- `PUT /api/v1/supplements/{id}` - Update supplement
- `DELETE /api/v1/supplements/{id}` - Delete supplement

### Workouts
- `GET /api/v1/workouts` - Get all workout programs
- `GET /api/v1/workouts/{id}` - Get workout by ID
- `POST /api/v1/workouts` - Create workout program
- `PUT /api/v1/workouts/{id}` - Update workout program
- `DELETE /api/v1/workouts/{id}` - Delete workout program

### Health
- `GET /api/v1/health` - Health check

---

## 🔌 Usage Examples

### Frontend - Using Hooks

#### Authentication
```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ 
        email: 'user@example.com', 
        password: 'password' 
      });
      // Success! user is now logged in
    } catch (error) {
      // Error handled automatically with toast
    }
  };
}
```

#### Foods
```typescript
import { useFoods } from '@/hooks/useFoods';

function FoodList() {
  const { foods, isLoading, createFood } = useFoods({ 
    category: 'protein' 
  });

  if (isLoading) return <Skeleton />;

  return (
    <div>
      {foods.map(food => (
        <div key={food.id}>{food.name}</div>
      ))}
    </div>
  );
}
```

#### Supplements
```typescript
import { useSupplements } from '@/hooks/useSupplements';

function SupplementList() {
  const { supplements, isLoading } = useSupplements({
    evidence_level: 'strong'
  });

  return (
    <div>
      {supplements.map(supp => (
        <div key={supp.id}>
          {supp.name} - {supp.standard_dose}{supp.dose_unit}
        </div>
      ))}
    </div>
  );
}
```

#### Workout Store
```typescript
import { useWorkoutStore } from '@/store/workoutStore';

function WorkoutBuilder() {
  const { 
    currentProgram, 
    saveProgram, 
    loadProgram,
    loadAllPrograms 
  } = useWorkoutStore();

  const handleSave = async () => {
    await saveProgram(); // Saves to SQLite
  };

  const handleLoad = async (id: string) => {
    await loadProgram(id); // Loads from SQLite
  };

  const handleLoadAll = async () => {
    const programs = await loadAllPrograms();
    console.log(programs);
  };
}
```

---

## 🛡️ Type Safety

All API responses are fully typed:

```typescript
import { Exercise, Food, Supplement, User } from '@/services/api';

// TypeScript knows the exact shape of these objects
const exercise: Exercise = await exercisesApi.getById('ex_001');
const food: Food = await foodsApi.getById('food_001');
const supplement: Supplement = await supplementsApi.getById('supp_001');
```

---

## 🚨 Error Handling

All hooks automatically handle errors with `react-hot-toast`:

```typescript
// Automatic error handling
const { foods, error } = useFoods();

// If server is down:
// Toast shows: "Connection to local server failed. Please ensure the backend is running."

// If specific error:
// Toast shows: "Failed to load foods"
```

Manual error handling:
```typescript
try {
  await foodsApi.create(newFood);
} catch (error) {
  const apiError = error as ApiError;
  console.error(apiError.detail);
  console.error(apiError.status);
}
```

---

## 📝 Data Schema

### Exercise
```typescript
{
  id: string;
  name: string;
  category: 'resistance' | 'cardio' | 'plyometric' | ...;
  primary_muscles: string[];
  secondary_muscles: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  description: string;
  instructions?: string;
  default_sets?: number;
  default_reps?: number;
  default_rest?: number;
  rpe?: number;
  tempo?: string;
  tags?: string[];
}
```

### Food
```typescript
{
  id: string;
  name: string;
  category: 'protein' | 'carbohydrate' | 'healthy_fat' | ...;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  benefits?: string;
  tags?: string[];
}
```

### Supplement
```typescript
{
  id: string;
  name: string;
  category: 'creatine' | 'protein' | 'amino_acid' | ...;
  standard_dose: number;
  dose_unit: 'g' | 'mg' | 'IU';
  timing: 'anytime' | 'pre_workout' | 'post_workout' | ...;
  evidence_level: 'strong' | 'moderate' | 'preliminary';
  benefits: string;
  instructions?: string;
  tags?: string[];
}
```

---

## 🔍 Testing

### Test Backend
```bash
curl http://localhost:8000/api/v1/health
# Expected: {"status":"healthy","message":"FlexPro API is running"}

curl http://localhost:8000/api/v1/exercises
# Expected: [{"id":"ex_barbell_bench_press","name":"Barbell Bench Press",...}]
```

### Test Frontend
1. Start backend
2. Start frontend
3. Open browser console
4. Should see no errors related to Supabase
5. API calls should go to `http://localhost:8000`

---

## 🎯 Benefits

1. **100% Offline** - No internet required
2. **Complete Control** - All data in local SQLite
3. **Type Safe** - Full TypeScript coverage
4. **Fast** - Local API = instant responses
5. **Portable** - Single SQLite file contains everything
6. **Scientific** - Rich data with evidence-based parameters

---

## 📦 Seeded Data

### Exercises (20+)
- Chest: Bench Press, Incline Press, Cable Crossover
- Back: Deadlift, Pull-Up, Barbell Row
- Shoulders: Overhead Press, Lateral Raise
- Legs: Squat, RDL, Bulgarian Split Squat
- Arms: Barbell Curl, Close-Grip Bench
- Cardio: Treadmill, Jump Rope
- Core: Plank

### Foods (12+)
- Proteins: Chicken, Salmon, Eggs, Greek Yogurt
- Carbs: Rice, Sweet Potato, Oatmeal, Banana
- Fats: Avocado, Almonds
- Vegetables: Broccoli, Spinach

### Supplements (8+)
- Creatine Monohydrate
- Whey Protein Isolate
- Beta-Alanine
- Citrulline Malate
- Vitamin D3
- Fish Oil
- Magnesium
- Caffeine

---

## 🆘 Troubleshooting

### "Connection to local server failed"
**Solution:** Start the backend
```bash
cd flexpro-ai-service
uvicorn app.main:app --reload
```

### "No exercises/foods/supplements found"
**Solution:** Run seeder
```bash
python -m app.db.seed
```

### "Token expired" or authentication errors
**Solution:** Clear localStorage and login again
```javascript
localStorage.clear();
// Refresh page and login
```

---

## 🎉 Summary

✅ Supabase completely removed  
✅ SQLite backend with FastAPI  
✅ Rich scientific data seeded  
✅ All hooks connected to API  
✅ Type-safe throughout  
✅ Error handling with toasts  
✅ Workout programs save/load  
✅ 100% offline capability

**The app is now fully local, fast, and ready for production!** 🚀
