# Background Components

## LightRays

A beautiful animated light rays background component inspired by reactbits.dev.

### Props

- `children?: React.ReactNode` - Content to render over the background
- `className?: string` - Additional CSS classes
- `color?: string` - Ray color (hex format, default: theme-aware)
- `speed?: 'slow' | 'medium' | 'fast'` - Animation speed (default: 'medium')
- `intensity?: 'subtle' | 'normal' | 'intense'` - Ray intensity (default: 'normal')

### Usage

```tsx
import { LightRays } from '../components/backgrounds';

function MyComponent() {
  return (
    <LightRays speed="slow" intensity="subtle">
      <div>My content here</div>
    </LightRays>
  );
}
```

### Features

- 🌙 Theme-aware (adapts to light/dark themes)
- 🎨 Customizable colors and intensity
- 📱 Responsive design
- ⚡ Optimized animations
- 🎯 Zero dependencies (besides React)