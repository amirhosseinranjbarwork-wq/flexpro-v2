"""
Workout generation service
Intelligent algorithm to create personalized workout plans
"""

import random
from typing import List, Dict, Any, Optional
from app.models.schemas import ClientProfile, WorkoutPlan
from app.db.supabase import get_exercises_by_muscle_groups


class WorkoutGenerator:
    """Intelligent workout plan generator"""

    # Exercise databases by muscle group and type
    MUSCLE_GROUPS = {
        'chest': ['پرس سینه با هالتر', 'پرس سینه با دمبل', 'پرس سینه با دستگاه', 'دیپ'],
        'back': ['کشش طناب', 'بارفیکس', 'پول اور', 'کشش تک دمبل'],
        'shoulders': ['جک پرس', ' lateral raise', 'فرونت رایز', 'rear delt fly'],
        'arms': ['جم دوسر', 'تریسپس اکستنشن', 'جم هالتر', 'کابل پوش'],
        'legs': ['اسکوات', 'لانج', 'لگ پرس', 'لگ اکستنشن'],
        'core': ['پلانک', 'کرنش', 'روسین ماشین', 'لگ رایز']
    }

    # Training splits based on experience and days per week
    SPLITS = {
        'beginner': {
            2: 'full_body',
            3: 'full_body',
            4: 'upper_lower'
        },
        'intermediate': {
            3: 'push_pull_legs',
            4: 'push_pull_legs',
            5: 'push_pull_legs_rest',
            6: 'push_pull_legs_legs'
        },
        'advanced': {
            4: 'push_pull_legs',
            5: 'push_pull_legs_legs',
            6: 'push_pull_legs_legs'
        }
    }

    # Volume recommendations based on goal
    VOLUME_CONFIGS = {
        'strength': {'sets': 5, 'reps': '5', 'rest': 180},
        'hypertrophy': {'sets': 4, 'reps': '8-12', 'rest': 120},
        'fat_loss': {'sets': 3, 'reps': '12-15', 'rest': 90},
        'maintenance': {'sets': 3, 'reps': '8-12', 'rest': 120}
    }

    async def generate_workout_plan(self, profile: ClientProfile) -> WorkoutPlan:
        """
        Generate a personalized workout plan based on client profile

        Args:
            profile: Client profile information

        Returns:
            WorkoutPlan: Generated workout plan
        """
        # Determine split type
        split_type = self._determine_split(profile)

        # Get available exercises (filtered by injuries and equipment)
        available_exercises = await self._get_available_exercises(profile)

        # Generate workouts for each training day
        workouts = self._generate_workouts(split_type, profile, available_exercises)

        return WorkoutPlan(
            split_type=split_type,
            weeks=4,  # Default 4-week program
            workouts=workouts
        )

    def _determine_split(self, profile: ClientProfile) -> str:
        """Determine the best training split for the client"""
        fitness_level = profile.fitness_level
        days_per_week = profile.days_per_week

        if fitness_level in self.SPLITS and days_per_week in self.SPLITS[fitness_level]:
            return self.SPLITS[fitness_level][days_per_week]

        # Fallback to full body for beginners
        return 'full_body'

    async def _get_available_exercises(self, profile: ClientProfile) -> Dict[str, List[str]]:
        """Get exercises filtered by injuries and equipment"""
        available_exercises = {}

        # Get exercises from database
        all_exercises = await get_exercises_by_muscle_groups(list(self.MUSCLE_GROUPS.keys()))

        for muscle_group in self.MUSCLE_GROUPS.keys():
            exercises = [ex['name'] for ex in all_exercises if ex['muscle_group'] == muscle_group]

            # Filter out exercises that might aggravate injuries
            if profile.injuries:
                exercises = self._filter_by_injuries(exercises, profile.injuries, muscle_group)

            # Filter by available equipment
            if profile.equipment_access:
                exercises = self._filter_by_equipment(exercises, profile.equipment_access)

            available_exercises[muscle_group] = exercises[:6]  # Limit to 6 exercises per group

        return available_exercises

    def _filter_by_injuries(self, exercises: List[str], injuries: List[str], muscle_group: str) -> List[str]:
        """Filter exercises based on injuries"""
        injury_keywords = {
            'shoulder': ['پرس', 'raise', 'press'],
            'back': ['کشش', 'pull', 'row'],
            'knee': ['اسکوات', 'لانج', 'jump'],
            'elbow': ['اکستنشن', 'تریسپس']
        }

        safe_exercises = []
        for exercise in exercises:
            is_safe = True
            for injury in injuries:
                if injury.lower() in injury_keywords and muscle_group in injury_keywords:
                    keywords = injury_keywords[muscle_group]
                    if any(keyword in exercise for keyword in keywords):
                        is_safe = False
                        break
            if is_safe:
                safe_exercises.append(exercise)

        return safe_exercises

    def _filter_by_equipment(self, exercises: List[str], equipment: List[str]) -> List[str]:
        """Filter exercises based on available equipment"""
        equipment_keywords = {
            'dumbbell': ['دمبل', 'dumbbell'],
            'barbell': ['هالتر', 'barbell'],
            'machine': ['دستگاه', 'machine'],
            'cable': ['کابل', 'cable'],
            'bodyweight': ['وزن بدن', 'bodyweight']
        }

        available_equipment = set()
        for eq in equipment:
            if eq.lower() in equipment_keywords:
                available_equipment.update(equipment_keywords[eq.lower()])

        filtered_exercises = []
        for exercise in exercises:
            required_equipment = self._get_required_equipment(exercise)
            if required_equipment <= available_equipment:
                filtered_exercises.append(exercise)

        return filtered_exercises

    def _get_required_equipment(self, exercise: str) -> set:
        """Determine equipment required for an exercise"""
        # Simplified logic - in real implementation, this would be more sophisticated
        if 'دمبل' in exercise or 'dumbbell' in exercise:
            return {'dumbbell'}
        elif 'هالتر' in exercise or 'barbell' in exercise:
            return {'barbell'}
        elif 'دستگاه' in exercise or 'machine' in exercise:
            return {'machine'}
        elif 'کابل' in exercise or 'cable' in exercise:
            return {'cable'}
        else:
            return {'bodyweight'}

    def _generate_workouts(self, split_type: str, profile: ClientProfile, exercises: Dict[str, List[str]]) -> Dict[str, List[Dict[str, Any]]]:
        """Generate workouts based on split type"""
        volume_config = self.VOLUME_CONFIGS[profile.goal]

        if split_type == 'full_body':
            return self._generate_full_body_workouts(exercises, volume_config)
        elif split_type == 'upper_lower':
            return self._generate_upper_lower_workouts(exercises, volume_config)
        elif split_type == 'push_pull_legs':
            return self._generate_push_pull_legs_workouts(exercises, volume_config)
        else:
            return self._generate_full_body_workouts(exercises, volume_config)

    def _generate_full_body_workouts(self, exercises: Dict[str, List[str]], volume_config: Dict) -> Dict[str, List[Dict[str, Any]]]:
        """Generate full body workouts"""
        workouts = {}

        # Select exercises for full body
        selected_exercises = []
        for muscle_group in ['chest', 'back', 'legs', 'shoulders', 'arms']:
            if exercises[muscle_group]:
                selected_exercises.append(random.choice(exercises[muscle_group]))

        # Create workout for each training day
        for day in range(1, 4):  # 3 days per week
            workout_exercises = []
            for exercise in selected_exercises:
                workout_exercises.append({
                    'name': exercise,
                    'sets': volume_config['sets'],
                    'reps': volume_config['reps'],
                    'rest': volume_config['rest'],
                    'notes': f'Day {day} - Focus on form'
                })

            workouts[f'day_{day}'] = workout_exercises

        return workouts

    def _generate_upper_lower_workouts(self, exercises: Dict[str, List[str]], volume_config: Dict) -> Dict[str, List[Dict[str, Any]]]:
        """Generate upper/lower split workouts"""
        workouts = {}

        upper_exercises = exercises['chest'] + exercises['back'] + exercises['shoulders'] + exercises['arms']
        lower_exercises = exercises['legs'] + exercises['core']

        # Upper body day
        upper_workout = []
        for exercise in random.sample(upper_exercises, min(4, len(upper_exercises))):
            upper_workout.append({
                'name': exercise,
                'sets': volume_config['sets'],
                'reps': volume_config['reps'],
                'rest': volume_config['rest']
            })
        workouts['upper'] = upper_workout

        # Lower body day
        lower_workout = []
        for exercise in random.sample(lower_exercises, min(4, len(lower_exercises))):
            lower_workout.append({
                'name': exercise,
                'sets': volume_config['sets'],
                'reps': volume_config['reps'],
                'rest': volume_config['rest']
            })
        workouts['lower'] = lower_workout

        return workouts

    def _generate_push_pull_legs_workouts(self, exercises: Dict[str, List[str]], volume_config: Dict) -> Dict[str, List[Dict[str, Any]]]:
        """Generate push/pull/legs split workouts"""
        workouts = {}

        # Push day (chest, shoulders, triceps)
        push_exercises = exercises['chest'] + exercises['shoulders'] + [ex for ex in exercises['arms'] if 'تریسپس' in ex or 'اکستنشن' in ex]
        push_workout = []
        for exercise in random.sample(push_exercises, min(4, len(push_exercises))):
            push_workout.append({
                'name': exercise,
                'sets': volume_config['sets'],
                'reps': volume_config['reps'],
                'rest': volume_config['rest']
            })
        workouts['push'] = push_workout

        # Pull day (back, biceps)
        pull_exercises = exercises['back'] + [ex for ex in exercises['arms'] if 'جم' in ex or 'curl' in ex.lower()]
        pull_workout = []
        for exercise in random.sample(pull_exercises, min(4, len(pull_exercises))):
            pull_workout.append({
                'name': exercise,
                'sets': volume_config['sets'],
                'reps': volume_config['reps'],
                'rest': volume_config['rest']
            })
        workouts['pull'] = pull_workout

        # Legs day
        legs_exercises = exercises['legs'] + exercises['core']
        legs_workout = []
        for exercise in random.sample(legs_exercises, min(4, len(legs_exercises))):
            legs_workout.append({
                'name': exercise,
                'sets': volume_config['sets'],
                'reps': volume_config['reps'],
                'rest': volume_config['rest']
            })
        workouts['legs'] = legs_workout

        return workouts