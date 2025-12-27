# Migration Guide: Supabase to Local SQLite

This guide documents the migration from Supabase (cloud) to a fully local SQLite database system.

## Overview

The project has been migrated to run completely offline using:
- **Backend**: Python FastAPI with SQLite database (`flexpro.db`)
- **Frontend**: React/Vite with API service pointing to `http://localhost:8000`

## Backend Changes

### New Files Created

1. **`flexpro-ai-service/app/db/database.py`**
   - SQLite database setup
   - Creates `flexpro.db` in the root of `flexpro-ai-service/`
   - Provides database session management

2. **`flexpro-ai-service/app/models/sql_models.py`**
   - SQLAlchemy models: `User`, `Exercise`, `Food`, `WorkoutPlan`
   - Mirrors TypeScript interfaces from frontend

3. **`flexpro-ai-service/app/db/seed.py`**
   - Database seeding script
   - Populates exercises on first run
   - Creates default admin user (username: `admin`, password: `admin123`)

4. **`flexpro-ai-service/app/core/auth.py`**
   - Local JWT token generation and verification
   - Password hashing with bcrypt

5. **`flexpro-ai-service/app/api/v1/endpoints/auth.py`**
   - `/api/v1/auth/login` - User login
   - `/api/v1/auth/register` - User registration
   - `/api/v1/auth/me` - Get current user info

6. **`flexpro-ai-service/app/api/v1/endpoints/exercises.py`**
   - `/api/v1/exercises/` - Get all exercises (with filters)
   - `/api/v1/exercises/{id}` - Get exercise by ID
   - `/api/v1/exercises/by-exercise-id/{exercise_id}` - Get by original ID

7. **`flexpro-ai-service/app/api/v1/endpoints/workouts.py`**
   - `/api/v1/workouts/` - Get/create workout plans
   - `/api/v1/workouts/{id}` - Get/update/delete workout plan
   - `/api/v1/workouts/user/{user_id}` - Get plans for user (coach only)

8. **`flexpro-ai-service/app/api/v1/endpoints/foods.py`**
   - `/api/v1/foods/` - Get all foods (with filters)
   - `/api/v1/foods/{id}` - Get food by ID

### Updated Files

1. **`flexpro-ai-service/requirements.txt`**
   - Added: `sqlalchemy==2.0.23`, `aiosqlite==0.19.0`, `passlib[bcrypt]==1.7.4`

2. **`flexpro-ai-service/app/main.py`**
   - Removed Supabase initialization
   - Added SQLite database initialization
   - Auto-seeds database on startup if empty

3. **`flexpro-ai-service/app/core/security.py`**
   - Updated to use local JWT verification instead of Supabase

4. **`flexpro-ai-service/app/api/v1/api.py`**
   - Added new routers for auth, exercises, workouts, foods

## Frontend Changes

### New Files Created

1. **`src/services/api.ts`**
   - Centralized API client
   - Handles authentication tokens
   - Provides typed API methods for auth, exercises, workouts, foods

### Updated Files

1. **`src/context/AuthContext.tsx`**
   - Updated `signInWithPassword` to use API service
   - Updated `register` to use API service
   - Updated `signOut` to clear API token
   - Falls back to local auth if API fails (backward compatibility)

2. **`src/hooks/useExercises.ts`**
   - Updated to fetch from API endpoint
   - Falls back to static data if API fails

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd flexpro-ai-service
   pip install -r requirements.txt
   ```

2. **Set Environment Variables** (optional)
   Create `.env` file:
   ```env
   SECRET_KEY=your-secret-key-change-in-production
   ENVIRONMENT=development
   ```

3. **Run the Server**
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The database will be automatically created and seeded on first run.

4. **Manual Seeding** (optional)
   ```bash
   python -m app.db.seed
   # Or with JSON file:
   python -m app.db.seed path/to/exercises.json
   ```

### Frontend Setup

1. **Set API URL** (optional, defaults to `http://localhost:8000`)
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

2. **Run Frontend**
   ```bash
   npm install
   npm run dev
   ```

## API Endpoints

### Authentication (No auth required)

- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `GET /api/v1/auth/me` - Get current user (requires auth)

### Exercises (Requires auth)

- `GET /api/v1/exercises/` - List exercises
  - Query params: `category`, `muscle_group`, `equipment`, `search`
- `GET /api/v1/exercises/{id}` - Get exercise by ID
- `GET /api/v1/exercises/by-exercise-id/{exercise_id}` - Get by original ID

### Workouts (Requires auth)

- `GET /api/v1/workouts/` - List user's workout plans
  - Query params: `plan_type`
- `POST /api/v1/workouts/` - Create workout plan
- `GET /api/v1/workouts/{id}` - Get workout plan
- `PUT /api/v1/workouts/{id}` - Update workout plan
- `DELETE /api/v1/workouts/{id}` - Delete workout plan
- `GET /api/v1/workouts/user/{user_id}` - Get plans for user (coach only)

### Foods (Requires auth)

- `GET /api/v1/foods/` - List foods
  - Query params: `category`, `search`
- `GET /api/v1/foods/{id}` - Get food by ID

## Database Schema

### Users Table
- `id` (Integer, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique, Optional)
- `password_hash` (String)
- `full_name` (String, Optional)
- `role` (String: 'coach' or 'client')
- `coach_code` (String, Unique, Optional)
- `is_super_admin` (Integer: 0 or 1)
- `created_at`, `updated_at` (DateTime)

### Exercises Table
- `id` (Integer, Primary Key)
- `exercise_id` (String, Unique) - Original ID from TypeScript
- `name` (String)
- `category`, `muscle_group`, `equipment`, `type`, `difficulty` (Strings)
- `scientific_data` (JSON) - Full exercise object
- `created_at`, `updated_at` (DateTime)

### Foods Table
- `id` (Integer, Primary Key)
- `food_id` (String, Unique) - Original ID
- `name`, `name_en` (Strings)
- `category`, `subcategory` (Strings)
- `calories` (Integer)
- `macros` (JSON) - Nutrition data
- `created_at`, `updated_at` (DateTime)

### Workout Plans Table
- `id` (Integer, Primary Key)
- `user_id` (Integer, Foreign Key -> Users)
- `data` (JSON) - Full workout plan structure
- `plan_name`, `plan_type` (Strings, Optional)
- `created_at`, `updated_at` (DateTime)

## Authentication Flow

1. User logs in via `POST /api/v1/auth/login`
2. Server returns JWT token
3. Frontend stores token in localStorage (`flexpro_token`)
4. All subsequent requests include token in `Authorization: Bearer <token>` header
5. Server validates token on each request

## Migration Notes

- The system maintains backward compatibility with local auth fallback
- Supabase code is still present but not used by default
- Database file (`flexpro.db`) is created automatically in `flexpro-ai-service/` root
- All complex data structures are stored as JSON in SQLite
- Default admin user is created on first seed (username: `admin`, password: `admin123`)

## Troubleshooting

1. **Database not created**: Check file permissions in `flexpro-ai-service/` directory
2. **API connection failed**: Ensure backend is running on port 8000
3. **Authentication errors**: Check that token is being sent in headers
4. **Empty exercises**: Run seeding script manually: `python -m app.db.seed`

## Next Steps

- Export exercise data from TypeScript to JSON for seeding
- Add more endpoints as needed (foods, supplements, etc.)
- Implement data migration tools if needed
- Add database backup/restore functionality

