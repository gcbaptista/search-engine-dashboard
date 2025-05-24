# CLAUDE.md - Search Engine Dashboard Development Guide

This document serves as a comprehensive guide for developers working on the Search Engine Dashboard project. It outlines conventions, coding styles, architecture patterns, and development procedures that should be followed when contributing to this project.

## Project Overview

### Purpose

The Search Engine Dashboard is a modern, responsive web application for managing search engine indexes, documents, and performing searches. It provides an Algolia-inspired interface with global index selection, smart loading strategies, and progressive enhancement.

### Key Features

- **Algolia-Inspired Global Index Selection**: Context-aware pages with seamless index switching
- **Smart Loading & Performance**: Lightning-fast startup with progressive enhancement
- **Core Functionality**: Index management, document management, advanced search, analytics
- **Modern UI/UX**: Responsive design with gradient backgrounds and smooth animations

### Technology Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Heroicons 2.2.0, Lucide React 0.511.0
- **HTTP Client**: Axios 1.9.0
- **State Management**: React Context + useReducer
- **Build Tool**: Turbopack (dev mode)

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics dashboard
│   ├── api/proxy/         # API proxy routes
│   ├── documents/         # Document management
│   ├── indexes/           # Index management
│   ├── search/            # Search interface
│   └── settings/          # Settings pages
├── components/            # React components organized by feature
│   ├── analytics/         # Analytics-specific components
│   ├── dashboard/         # Dashboard components
│   ├── documents/         # Document-related components
│   ├── indexes/           # Index-related components
│   ├── Layout/            # Layout components
│   ├── search/            # Search components
│   └── ui/                # Reusable UI components
├── context/               # React Context providers
├── lib/                   # Utility libraries and API clients
└── types/                 # TypeScript type definitions
```

### State Management Architecture

The project uses a centralized state management pattern with React Context and useReducer:

```typescript
// Central state structure
interface State {
  indexNames: string[]; // Lightweight list for fast load
  currentIndex: string | null; // Globally selected index
  indexDetailsCache: Map<string, IndexSettings>; // Smart caching
  loadingIndexes: Set<string>; // Track loading states
  // ... other state properties
}
```

### Smart Loading Strategy

1. **Initial Load**: Load only index names (fast startup)
2. **Auto-Selection**: Automatically select first available index
3. **Progressive Loading**: Load details in background with smart pacing
4. **Global Context**: All pages respect the globally selected index

## Coding Conventions

### TypeScript Configuration

- **Target**: ES2017
- **Strict Mode**: Enabled for better type safety
- **Path Mapping**: Use `@/*` for imports from `src/`
- **Module Resolution**: Bundler mode for Next.js compatibility

### File Naming Conventions

- **Components**: PascalCase (`SearchResults.tsx`)
- **Pages**: lowercase with kebab-case for folders (`analytics/page.tsx`)
- **Utilities**: camelCase (`searchEngineApi.ts`)
- **Types**: PascalCase interfaces exported from organized modules

### Import/Export Patterns

```typescript
// Prefer named exports for components
export const SearchResults: React.FC<Props> = ({ ... }) => { ... };

// Use default exports only for pages
export default function AnalyticsPage() { ... }

// Organize type exports centrally
export * from './core';
export * from './api';
```

### Component Organization

- **Feature-based**: Group components by domain (search, analytics, etc.)
- **Shared UI**: Common components in `ui/` directory
- **Layout**: Layout-specific components in `Layout/` directory
- **Co-location**: Keep related files together (components, types, utils)

### State Management Patterns

```typescript
// Use typed actions for state updates
type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "SET_INDEX_DETAILS";
      payload: { name: string; details: IndexSettings };
    };

// Implement smart caching patterns
const newCache = new Map(state.indexDetailsCache);
newCache.set(action.payload.name, action.payload.details);
```

### API Integration Patterns

```typescript
// Use Next.js API proxy for CORS handling
const baseURL = "/api/proxy";

// Implement proper error handling
try {
  const response = await searchAPI.search(selectedIndex, searchParams);
  return response.data;
} catch (error) {
  console.error("Search failed:", error);
  throw new Error("Search operation failed");
}
```

## Linting Rules

### ESLint Configuration

The project uses ESLint 9 with Next.js recommended configurations:

```javascript
// eslint.config.mjs
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
```

### Enforced Rules

- **Next.js Core Web Vitals**: Performance and accessibility rules
- **TypeScript Integration**: Type-aware linting rules
- **React Best Practices**: Hooks rules, component patterns

### Code Quality Standards

- **No unused variables**: Clean up imports and declarations
- **Consistent naming**: Follow established naming conventions
- **Type safety**: Avoid `any` types, prefer explicit typing
- **Accessibility**: Follow WCAG guidelines for components

### Running Linting

```bash
# Run ESLint
npm run lint

# Auto-fix issues (when possible)
npm run lint -- --fix
```

## Styling Guidelines

### Tailwind CSS Configuration

- **Content Sources**: All TypeScript/JSX files in `src/`
- **Custom Colors**: Use CSS variables for theme colors
- **Responsive Design**: Mobile-first approach with responsive utilities

### CSS Patterns

```typescript
// Use clsx for conditional classes
import { clsx } from 'clsx';

const buttonClasses = clsx(
  'base-button-styles',
  isActive && 'active-styles',
  isDisabled && 'disabled-styles'
);

// Prefer Tailwind utilities over custom CSS
<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4">
```

### Design System

- **Gradients**: Use for backgrounds and visual appeal
- **Spacing**: Follow Tailwind's spacing scale
- **Typography**: Use Tailwind's font utilities
- **Colors**: Leverage CSS custom properties for theming

## Testing Procedures

### Current State

The project currently does not have a testing framework configured. This section outlines the recommended testing approach for future implementation.

### Recommended Testing Stack

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Jest + MSW (Mock Service Worker)
- **E2E Tests**: Playwright or Cypress
- **Type Checking**: TypeScript compiler

### Testing Strategy

```typescript
// Unit tests for components
describe("SearchResults", () => {
  it("renders search results correctly", () => {
    // Test implementation
  });
});

// Integration tests for API interactions
describe("Search API", () => {
  it("handles search requests properly", async () => {
    // Mock API responses
    // Test API integration
  });
});
```

### Coverage Requirements

- **Minimum Coverage**: 80% for utility functions
- **Component Testing**: Focus on user interactions and state changes
- **API Testing**: Mock external dependencies, test error handling

## Project Setup

### Prerequisites

- **Node.js**: Version 18 or higher
- **Package Manager**: npm or yarn
- **Go Search Engine API**: Running on `localhost:8080`

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd search-engine-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   # Ensure Go Search Engine API is running on localhost:8080
   # No additional environment variables required
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Verify installation**
   - Open `http://localhost:3000`
   - Verify index selection dropdown appears
   - Test basic navigation between pages

### Development Scripts

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### API Integration Setup

The dashboard requires a Go Search Engine API running on `localhost:8080`. The Next.js application includes a proxy at `/api/proxy/[...path]` to handle CORS and route requests to the backend API.

## Contributing Guidelines

### Pull Request Process

1. **Create feature branch** from `main`
2. **Follow naming convention**: `feature/description` or `fix/description`
3. **Implement changes** following coding conventions
4. **Update documentation** if adding new features
5. **Test locally** before submitting
6. **Create pull request** with descriptive title and description

### Code Review Requirements

- **Type Safety**: Ensure TypeScript errors are resolved
- **Linting**: Code must pass ESLint checks
- **Architecture**: Follow established patterns and conventions
- **Performance**: Consider impact on loading times and user experience
- **Accessibility**: Ensure components are accessible

### Commit Message Format

```
type(scope): description

Examples:
feat(search): add advanced filtering options
fix(indexes): resolve index selection bug
docs(readme): update installation instructions
style(ui): improve button hover states
```

### Development Workflow

1. **Start with issues**: Check existing issues or create new ones
2. **Local development**: Use `npm run dev` with hot reloading
3. **Code quality**: Run `npm run lint` before committing
4. **Testing**: Manually test affected functionality
5. **Documentation**: Update relevant documentation

### Performance Considerations

- **Smart Loading**: Maintain progressive loading patterns
- **Caching**: Utilize existing caching mechanisms
- **Bundle Size**: Monitor impact on bundle size
- **API Calls**: Minimize redundant API requests
- **User Experience**: Ensure sub-second page transitions

### Accessibility Requirements

- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Screen Readers**: Provide appropriate ARIA labels and descriptions
- **Color Contrast**: Ensure sufficient contrast ratios
- **Focus Management**: Implement proper focus management for dynamic content

## Additional Resources

### Key Files to Reference

- `src/context/SearchEngineContext.tsx`: Central state management
- `src/lib/searchEngineApi.ts`: API client implementation
- `src/types/index.ts`: Type definitions entry point
- `tailwind.config.ts`: Styling configuration
- `next.config.ts`: Next.js configuration

### External Documentation

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Context Documentation](https://react.dev/reference/react/useContext)

---

This document should be updated as the project evolves and new patterns or conventions are established.
