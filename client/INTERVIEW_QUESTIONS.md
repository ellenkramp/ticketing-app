# React TypeScript Interview Questions

This directory contains TypeScript-based React components that demonstrate common interview question patterns.

## Components

### 1. Accordion Component (`components/Accordion.tsx`)

A fully typed accordion component that allows users to expand and collapse content sections.

**Features:**
- TypeScript interfaces for type safety
- `useState` hook for state management
- Conditional rendering
- Event handling
- Props with default values
- Single or multiple expand modes

**Props:**
```typescript
interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;  // Default: false
}
```

**Usage:**
```tsx
import Accordion from '../components/Accordion';

const items = [
  { id: '1', title: 'Title 1', content: 'Content 1' },
  { id: '2', title: 'Title 2', content: 'Content 2' },
];

// Single expand mode
<Accordion items={items} />

// Multiple expand mode
<Accordion items={items} allowMultiple={true} />
```

### 2. TodoList Component (`components/TodoList.tsx`)

A classic todo list component with full CRUD functionality.

**Features:**
- CRUD operations (Create, Read, Update, Delete)
- Form input handling
- Keyboard events (Enter to submit)
- Array manipulation methods
- Computed values (statistics)
- Conditional styling

**Props:**
```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  initialTodos?: Todo[];  // Optional initial todo items
}
```

**Usage:**
```tsx
import TodoList from '../components/TodoList';

const initialTodos = [
  { id: '1', text: 'Learn React', completed: true },
  { id: '2', text: 'Learn TypeScript', completed: false },
];

<TodoList initialTodos={initialTodos} />
```

### 3. Counter Component (`components/Counter.tsx`)

A simple counter component with increment, decrement, and reset functionality, with support for custom step sizes and range limits.

**Features:**
- State updates with callbacks
- Optional props with defaults
- Boundary validation (min/max limits)
- Disabled button states when limits are reached
- Flexible configuration
- Multiple instances support

**Props:**
```typescript
interface CounterProps {
  initialValue?: number;  // Default: 0
  step?: number;          // Default: 1
  min?: number;           // Default: Number.MIN_SAFE_INTEGER
  max?: number;           // Default: Number.MAX_SAFE_INTEGER
}
```

**Usage:**
```tsx
import Counter from '../components/Counter';

// Basic counter
<Counter />

// Counter with custom step
<Counter initialValue={10} step={5} />

// Counter with range limits
<Counter initialValue={5} min={0} max={10} />
```

## Demo Page

Visit `/interview-questions` to see a live demo of all components with examples and documentation.

The page showcases:
- Single-expand accordion
- Multi-expand accordion
- Interactive todo list
- Counter with different configurations
- Feature documentation

## TypeScript Configuration

The project includes `tsconfig.json` with settings optimized for Next.js development:
- ES5 target for broad browser compatibility
- Strict mode disabled for easier migration
- JSX preservation for Next.js
- ESModule interoperability

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npx tsc --noEmit
```

## Interview Topics Covered

These components demonstrate understanding of:

1. **React Fundamentals**
   - Functional components
   - Props and state
   - Event handling
   - Conditional rendering
   - Lists and keys

2. **TypeScript**
   - Interface definitions
   - Generic types
   - Type safety
   - Optional parameters
   - Type inference

3. **React Hooks**
   - `useState` for state management
   - State updates with callbacks
   - Setting complex state (Sets, Arrays)

4. **Best Practices**
   - Component composition
   - Controlled components
   - Immutable state updates
   - Semantic HTML
   - Accessibility considerations
