# 🧪 Backend Testing Guide

## Quick Start Testing

### 1. Start Backend
```bash
cd flexpro-ai-service
uvicorn app.main:app --reload
```

### 2. Run Seeder
```bash
python -m app.db.seed
```

**Expected Output:**
```
INFO:     Starting database seeding...
INFO:     Seeding 20 exercises...
INFO:     ✓ Seeded 20 exercises
INFO:     Seeding 12 foods...
INFO:     ✓ Seeded 12 foods
INFO:     Seeding 8 supplements...
INFO:     ✓ Seeded 8 supplements
INFO:     ✓ Database seeding completed successfully!
```

---

## API Testing

### Health Check
```bash
curl http://localhost:8000/api/v1/health
```

**Expected:**
```json
{
  "status": "healthy",
  "service": "FlexPro AI Service",
  "version": "1.0.0"
}
```

---

### Exercises

#### Get All Exercises
```bash
curl http://localhost:8000/api/v1/exercises
```

#### Filter by Category
```bash
curl "http://localhost:8000/api/v1/exercises?category=resistance"
curl "http://localhost:8000/api/v1/exercises?category=cardio"
```

#### Filter by Difficulty
```bash
curl "http://localhost:8000/api/v1/exercises?difficulty=beginner"
curl "http://localhost:8000/api/v1/exercises?difficulty=intermediate"
```

#### Filter by Equipment
```bash
curl "http://localhost:8000/api/v1/exercises?equipment=barbell"
curl "http://localhost:8000/api/v1/exercises?equipment=dumbbell"
curl "http://localhost:8000/api/v1/exercises?equipment=bodyweight"
```

#### Search by Name
```bash
curl "http://localhost:8000/api/v1/exercises?search=bench"
curl "http://localhost:8000/api/v1/exercises?search=squat"
```

#### Get Specific Exercise
```bash
curl http://localhost:8000/api/v1/exercises/ex_barbell_bench_press
```

---

### Foods

#### Get All Foods
```bash
curl http://localhost:8000/api/v1/foods
```

#### Filter by Category
```bash
curl "http://localhost:8000/api/v1/foods?category=protein"
curl "http://localhost:8000/api/v1/foods?category=carbohydrate"
curl "http://localhost:8000/api/v1/foods?category=healthy_fat"
```

#### Search by Name
```bash
curl "http://localhost:8000/api/v1/foods?search=chicken"
curl "http://localhost:8000/api/v1/foods?search=rice"
```

#### Get Specific Food
```bash
curl http://localhost:8000/api/v1/foods/food_chicken_breast
```

---

### Supplements

#### Get All Supplements
```bash
curl http://localhost:8000/api/v1/supplements
```

#### Filter by Category
```bash
curl "http://localhost:8000/api/v1/supplements?category=creatine"
curl "http://localhost:8000/api/v1/supplements?category=protein"
```

#### Filter by Evidence Level
```bash
curl "http://localhost:8000/api/v1/supplements?evidence_level=strong"
curl "http://localhost:8000/api/v1/supplements?evidence_level=moderate"
```

#### Search by Name
```bash
curl "http://localhost:8000/api/v1/supplements?search=creatine"
curl "http://localhost:8000/api/v1/supplements?search=protein"
```

#### Get Specific Supplement
```bash
curl http://localhost:8000/api/v1/supplements/supp_creatine_monohydrate
```

---

## Expected Data Counts

After seeding:
- **Exercises**: 20+
  - Resistance: 11 (Bench Press, Deadlift, Pull-Up, Row, Overhead Press, etc.)
  - Cardio: 2 (Treadmill, Jump Rope)
  - Core: 1 (Plank)
  
- **Foods**: 12+
  - Proteins: 4 (Chicken, Salmon, Eggs, Greek Yogurt)
  - Carbs: 4 (Rice, Sweet Potato, Oatmeal, Banana)
  - Fats: 2 (Avocado, Almonds)
  - Veggies: 2 (Broccoli, Spinach)
  
- **Supplements**: 8
  - Creatine Monohydrate
  - Whey Protein Isolate
  - Beta-Alanine
  - Citrulline Malate
  - Vitamin D3
  - Fish Oil
  - Magnesium Glycinate
  - Caffeine Anhydrous

---

## Sample Response Examples

### Exercise Response
```json
{
  "id": "ex_barbell_bench_press",
  "name": "Barbell Bench Press",
  "category": "resistance",
  "primary_muscles": ["chest"],
  "secondary_muscles": ["triceps", "shoulders"],
  "equipment": ["barbell"],
  "difficulty": "intermediate",
  "description": "The king of upper body pressing movements...",
  "instructions": "Retract scapulae, arch lower back slightly...",
  "default_sets": 4,
  "default_reps": 6,
  "default_rest": 180,
  "rpe": 8,
  "tempo": "3-0-1-0",
  "tags": ["compound", "mass_builder", "powerlifting", "strength"]
}
```

### Food Response
```json
{
  "id": "food_chicken_breast",
  "name": "Chicken Breast (Skinless)",
  "category": "protein",
  "serving_size": 100,
  "serving_unit": "100g",
  "calories": 165,
  "protein": 31,
  "carbs": 0,
  "fat": 3.6,
  "fiber": 0,
  "benefits": "High protein, low fat, excellent bioavailability",
  "tags": ["lean_protein", "muscle_building", "staple"]
}
```

### Supplement Response
```json
{
  "id": "supp_creatine_monohydrate",
  "name": "Creatine Monohydrate",
  "category": "creatine",
  "standard_dose": 5,
  "dose_unit": "g",
  "timing": "anytime",
  "evidence_level": "strong",
  "benefits": "Increases muscle creatine stores, enhances strength...",
  "instructions": "5g daily, loading phase optional...",
  "tags": ["most_researched", "highly_effective", "affordable"]
}
```

---

## Troubleshooting

### "Module not found: app.models.sql_models_extended"
**Solution:** Make sure the file exists:
```bash
ls flexpro-ai-service/app/models/sql_models_extended.py
```

### "Table doesn't exist"
**Solution:** Run the seeder, which creates tables automatically:
```bash
python -m app.db.seed
```

### "No data returned"
**Solution:** Check if database was seeded:
```bash
ls flexpro.db  # Should exist
python -m app.db.seed  # Re-run seeder
```

### Authentication Required Error
**Solution:** Some endpoints require authentication. For now, endpoints without auth:
- `/health`
- `/exercises` (may need to remove auth dependency)
- `/foods` (may need to remove auth dependency)
- `/supplements` (no auth by default)

---

## Next Steps

1. ✅ Backend is running
2. ✅ Data is seeded
3. ✅ API endpoints work
4. 🎯 Start frontend and test integration:
   ```bash
   npm run dev
   ```

5. 🎯 Test hooks in browser console:
   ```javascript
   // In React app
   const { supplements } = useSupplements();
   console.log(supplements);
   ```

---

## Performance Benchmarks

Expected response times (local SQLite):
- Health check: < 5ms
- Get all exercises (20 items): < 10ms
- Get all foods (12 items): < 8ms
- Get all supplements (8 items): < 6ms
- Single item by ID: < 5ms

**Total API startup**: < 2 seconds

---

Happy Testing! 🚀
