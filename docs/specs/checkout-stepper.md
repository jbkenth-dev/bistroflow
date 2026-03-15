# Checkout Stepper Component Specification

## Overview
The `CheckoutStepper` is a horizontal progress indicator designed for multi-step checkout processes. It provides visual feedback on the current user journey state, indicating completed, active, and future steps.

## Design System Integration

### Typography
- **Labels**: Uppercase, tracking-wider (`0.05em`), font-bold.
- **Step Numbers**: Monospace font (`font-mono`) for tabular alignment, font-bold.
- **Sizes**:
  - Desktop: Text-xs (12px)
  - Mobile: Text-[10px]

### Color Palette (Tailwind CSS)
- **Primary**: `var(--primary)` (Orange-500 equivalent in default theme)
- **Neutral**: `gray-100` (Track background), `gray-200` (Border), `gray-400` (Inactive text)
- **Surface**: `white` (Step circle background)
- **Text**: `white` (Active step text), `gray-400` (Inactive step text)

### Spacing (8-point Grid)
- **Step Circle**: 40px (10 units) on desktop, 32px (8 units) on mobile.
- **Track Height**: 4px (1 unit).
- **Gap**: 8px (2 units) between circle and label.

### Micro-interactions
- **Hover**: Scale up to 1.05x (`duration-200 ease-out`).
- **Tap/Active**: Scale down to 0.95x.
- **Current Step**: Scale 1.1x with shadow-md and ring-2.
- **Progress Bar**: Smooth width transition (`duration-500 ease-in-out`).

## Accessibility (WCAG 2.2 AA)
- **ARIA Roles**:
  - `nav` wrapper with `aria-label="Checkout Progress"`.
  - `button` for interactive steps.
- **Attributes**:
  - `aria-current="step"` for the active step.
  - `aria-label` includes step status (e.g., "Step 1: Summary, completed").
  - `aria-hidden="true"` for redundant visual text labels.
- **Keyboard Navigation**:
  - Tab focusable (when interactive).
  - Visible focus ring (`focus-visible:ring-2`).
- **Contrast**:
  - Active/Completed steps: White text on Primary background (> 4.5:1).
  - Inactive steps: Gray-400 on White background (Non-text contrast > 3:1).

## Component API

```typescript
interface Step {
  id: number;
  label: string;
}

interface CheckoutStepperProps {
  currentStep: number;     // 1-based index
  steps: Step[];           // Array of step objects
  className?: string;      // Additional classes
  onStepClick?: (id: number) => void; // Optional handler
}
```

## Responsive Behavior
- **Mobile (< 768px)**: Smaller circles (32px), smaller text (10px).
- **Desktop (>= 768px)**: Larger circles (40px), standard text (12px).
- **Layout**: Flexbox with `justify-between` ensures equal spacing regardless of container width.

## RTL Support
- Layout uses logical Flexbox properties (`justify-between`), which automatically adapts to RTL direction if `dir="rtl"` is set on the html/body tag.
