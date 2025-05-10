# Triply Dashboard

A multi-step onboarding flow built with Vue 3, TypeScript, and Vite.

## Development Process Overview

### Architecture
- Vue 3 Composition API with TypeScript
- Pinia for state management
- VeeValidate for form validation
- MSW (Mock Service Worker) for API mocking
- Vitest for testing
- TailwindCSS for styling

### Component Structure
- Multi-step onboarding flow with navigation
- Form validation using Zod schemas
- File upload handling with validation
- Responsive design with TailwindCSS
- Toast notifications for user feedback

### State Management
- Centralized store using Pinia
- Persistent form data across steps
- Clear and restart functionality
- Form validation state management

### Form Validation
- Zod schemas for robust validation
- Real-time validation feedback
- Custom validation rules for specific fields
- File upload validation

## API Mocking Implementation

### MSW Setup
- Implemented using Mock Service Worker (MSW)
- Mock endpoints defined in `src/plugins/server/handlers`
- Industry options endpoint with mock data
- Support for both successful and failing responses
- Development environment only (disabled in production)

### Industry Options
- Mock endpoint: `/api/industries`
- Returns predefined list of industries
- Simulates network delay
- Handles error states
- Type-safe responses using TypeScript interfaces

### Testing
- Vitest for unit testing
- Testing Library for Vue component testing
- Mock store setup for Pinia
- File upload mocking
- Form validation testing

## Setup and Run

```sh
yarn
```

### Development

```sh
yarn dev
```

### Production Build

```sh
yarn build
```

### Running Unit Tests

```sh
yarn test
```

The test suite uses Vitest and includes:
- Component rendering tests
- Form validation tests
- Store state management tests
- User interaction tests
- File upload handling tests
- Error state tests

Tests are automatically watched for changes during development.
