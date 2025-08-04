# Project Structure

## Current Organization
```
├── backend/          # Backend API and services (currently empty)
├── frontend/         # React/Next.js frontend application (currently empty)
├── docs/            # Project documentation
│   ├── plano_implementacao.md  # Detailed implementation plan
│   └── plano_implementacao.pdf # PDF version of implementation plan
└── .kiro/           # Kiro configuration and steering files
    └── steering/    # AI assistant guidance documents
```

## Planned Structure

### Backend Structure
```
backend/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── auth/         # Authentication & authorization
│   │   ├── users/        # User management (students/teachers)
│   │   ├── scheduling/   # Lesson booking and calendar
│   │   ├── payments/     # Payment processing
│   │   ├── media/        # File upload and management
│   │   ├── chat/         # Real-time messaging
│   │   └── admin/        # Administrative functions
│   ├── shared/           # Shared utilities and types
│   ├── database/         # Database schemas and migrations
│   └── config/           # Configuration files
├── tests/                # Test files
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Next.js pages/routes
│   │   ├── student/     # Student-specific pages
│   │   ├── teacher/     # Teacher-specific pages
│   │   └── admin/       # Admin dashboard pages
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API service functions
│   ├── store/           # State management
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles and themes
├── public/              # Static assets
└── package.json
```

## Key Architectural Principles
- **Separation of Concerns**: Clear boundaries between frontend, backend, and data layers
- **Modular Design**: Backend organized into feature modules for maintainability
- **Type Safety**: TypeScript throughout the stack for better developer experience
- **Scalability**: Structure supports future migration to microservices
- **Documentation**: Keep implementation plan and technical docs up to date

## File Naming Conventions
- Use kebab-case for file and folder names
- Use PascalCase for React components
- Use camelCase for functions and variables
- Use UPPER_SNAKE_CASE for constants and environment variables

## Import Organization
- External libraries first
- Internal modules second
- Relative imports last
- Group imports by type (components, hooks, utils, etc.)