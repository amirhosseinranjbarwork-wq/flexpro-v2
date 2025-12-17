# 🎨 UI Component Guide - SpotlightCard & MobileExerciseCard

## SpotlightCard Usage

### Basic Usage
```tsx
import { SpotlightCard } from '@/components';

export function MyComponent() {
  return (
    <SpotlightCard>
      <div className="p-6">
        <h2>Hover to see spotlight effect</h2>
        <p>This card has a cursor-tracking radial gradient</p>
      </div>
    </SpotlightCard>
  );
}
```

### With Customization
```tsx
<SpotlightCard
  className="p-8"
  spotlightColor="rgba(168, 85, 247, 0.15)"  // Purple
  glassEffect={true}
  interactive={true}
  onClick={() => console.log('Card clicked')}
>
  <h3>Custom Styled Card</h3>
</SpotlightCard>
```

### Props Reference
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Card content |
| `className` | `string` | `''` | Additional Tailwind classes |
| `spotlightColor` | `string` | `'rgba(59, 130, 246, 0.1)'` | Radial gradient color (RGB/RGBA) |
| `glassEffect` | `boolean` | `true` | Enable glassmorphism styling |
| `interactive` | `boolean` | `true` | Enable hover effects |
| `onClick` | `function` | - | Click handler |

### Spotlight Color Examples
```tsx
// Blue (Default)
spotlightColor="rgba(59, 130, 246, 0.1)"

// Purple
spotlightColor="rgba(168, 85, 247, 0.15)"

// Pink
spotlightColor="rgba(236, 72, 153, 0.15)"

// Green
spotlightColor="rgba(34, 197, 94, 0.1)"

// Amber
spotlightColor="rgba(251, 191, 36, 0.1)"
```

---

## MobileExerciseCard Usage

### In TrainingPanel (Automatic)
The component is automatically used in TrainingPanel on mobile screens:

```tsx
// Mobile View (< md / 768px)
<div className="md:hidden p-4 sm:p-6">
  <SortableContext items={...} strategy={verticalListSortingStrategy}>
    <AnimatePresence>
      {workoutItems.map((item, idx) => (
        <MobileExerciseCard
          key={`${day}-${idx}`}
          item={item}
          idx={idx}
          day={day}
          onDelete={handleDeleteExercise}
          canEdit={canEdit}
        />
      ))}
    </AnimatePresence>
  </SortableContext>
</div>
```

### Standalone Usage (If Needed)
```tsx
import MobileExerciseCard from '@/components/TrainingPanel/MobileExerciseCard';
import { WorkoutItem } from '@/types';

interface Props {
  exercise: WorkoutItem;
  index: number;
  sessionDay: number;
  onRemove: (index: number) => void;
  canEdit: boolean;
}

export function ExerciseListItem({
  exercise,
  index,
  sessionDay,
  onRemove,
  canEdit
}: Props) {
  return (
    <MobileExerciseCard
      item={exercise}
      idx={index}
      day={sessionDay}
      onDelete={onRemove}
      canEdit={canEdit}
    />
  );
}
```

### Card Structure
```
┌─────────────────────────────────────────┐
│ ⋮ ⋮ Exercise Name                    ✕  │  ← Drag handle, Title, Delete
│                                          │
│ 🔵 3 Sets  🟢 10 Reps  🟣 60s           │  ← Badge row (conditional)
│                                          │
│ 📝 Technical notes...                    │  ← Notes (if exists)
│ 📋 Exercise Type Badge                   │  ← Type indicator (if special)
└─────────────────────────────────────────┘
```

### Props Reference
| Prop | Type | Description |
|------|------|-------------|
| `item` | `WorkoutItem` | Exercise data object |
| `idx` | `number` | Index in workout list |
| `day` | `number` | Session day (1-7) |
| `onDelete` | `(idx: number) => void` | Delete callback |
| `canEdit` | `boolean` | Show/enable edit controls |

---

## WorkoutItem Type Reference

```tsx
interface WorkoutItem {
  mode: WorkoutMode;              // 'resist' | 'cardio' | 'corrective' | 'warmup' | 'cooldown'
  name: string;                   // Exercise name
  name2?: string;                 // Second exercise (superset)
  name3?: string;                 // Third exercise (triset)
  name4?: string;                 // Fourth exercise (giantset)
  type?: string;                  // 'normal' | 'nasm-corrective' | custom
  sets?: string | number;         // Number of sets
  reps?: string | number;         // Reps per set
  rest: string | number;          // Rest duration
  restUnit: 's' | 'm';            // 'seconds' or 'minutes'
  note?: string;                  // Technical notes
  duration?: string;              // For cardio
  intensity?: string;             // Low/moderate/high
  // ... other fields
}
```

---

## Responsive Behavior

### Automatic Breakpoint Switching
```tsx
{/* Desktop */}
<div className="hidden md:block">
  {/* Table view with ExerciseRow */}
</div>

{/* Mobile */}
<div className="md:hidden">
  {/* Card stack with MobileExerciseCard */}
</div>
```

### Screen Sizes
- **Mobile:** < 768px (Tailwind `md:` breakpoint)
- **Tablet:** 768px - 1024px (behaves as mobile view)
- **Desktop:** ≥ 1024px (table view with full columns)

---

## Animation Details

### SpotlightCard Entry Animation
```
Duration: 300ms
From: opacity 0, y +10px
To: opacity 1, y 0px
Easing: default (ease-out)
```

### MobileExerciseCard Entry Animation
```
Duration: 300ms
From: opacity 0, y +10px
To: opacity 1, y 0px
Exit: opacity 0, y -10px (300ms)
```

### Desktop Row Stagger
```
Each row delay: index × 50ms
Creates cascading entry effect
Maximum visual impact without lag
```

---

## Theme Customization

### Current Color Scheme (Tailwind)
```css
/* Glass Panel */
bg-white/5 border border-white/10 backdrop-blur-xl

/* Badges */
Sets:  bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30
Reps:  bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30
Rest:  bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30

/* Delete Button */
bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20
```

### Customizing Spotlight Colors
```tsx
// Override default blue with your accent color
<SpotlightCard
  spotlightColor={`rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.15)`}
>
  {children}
</SpotlightCard>
```

---

## Performance Considerations

### What's Optimized
✅ Spotlight effect uses CSS transforms (GPU accelerated)
✅ `useSortable` hook efficiently manages drag state
✅ `AnimatePresence` handles mount/unmount animations
✅ Conditional rendering avoids rendering hidden views

### Best Practices
- Use `key` prop for lists to maintain DOM identity
- Wrap in `SortableContext` for drag-and-drop
- Use `AnimatePresence` for enter/exit animations
- Memoize callbacks with `useCallback` to prevent re-renders

---

## Accessibility Features

### Keyboard Navigation
- Drag handle usable with keyboard (via `@dnd-kit/sortable`)
- Delete button has proper `:focus` styles
- Exercise name is clear and readable

### Screen Readers
- Semantic HTML (`<tr>`, `<tbody>`, `<button>`)
- Descriptive labels for each control
- Icon buttons paired with accessible names

### Mobile Touch
- 44x44px minimum touch targets
- Proper spacing between interactive elements
- Visual feedback on interaction

---

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest | ✅ Full |
| Firefox | Latest | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | Latest | ✅ Full |
| iOS Safari | 14+ | ✅ Full |
| Android Chrome | Latest | ✅ Full |

---

## Common Issues & Solutions

### Issue: Spotlight not appearing
**Solution:** Ensure `interactive={true}` and parent has `ref`

### Issue: Drag handle not working
**Solution:** Confirm `SortableContext` wraps component and `setNodeRef` is applied

### Issue: Mobile view on desktop
**Solution:** Check screen width; use DevTools to verify breakpoint

### Issue: Performance lag on drag
**Solution:** Check for excessive re-renders; use `React.memo` if needed

---

## Examples in Codebase

### TrainingPanel.tsx (Desktop)
```tsx
<motion.tr
  key={`${day}-${idx}`}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ delay: idx * 0.05 }}
>
  <ExerciseRow {...props} />
</motion.tr>
```

### TrainingPanel.tsx (Mobile)
```tsx
<MobileExerciseCard
  key={`${day}-${idx}`}
  item={item}
  idx={idx}
  day={day}
  onDelete={handleDeleteExercise}
  canEdit={canEdit}
/>
```

---

## Future Enhancements

1. **Swipe Gestures:** Add swipe-to-delete on mobile
2. **Animations:** More sophisticated motion options
3. **Themes:** Light/dark/custom color modes
4. **Variants:** Different card styles (elevated, outlined, filled)
5. **Loading States:** Skeleton cards during data fetch

---

**Questions?** Check `MASTER_REFACTOR_SUMMARY.md` for full context! 🚀
