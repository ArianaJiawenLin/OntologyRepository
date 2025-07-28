# Replit Application Documentation

## Overview

This is a full-stack TypeScript application built with React frontend and Express.js backend, focusing on academic research data management for scene graphs and robot world scenarios. The application provides file upload, storage, and visualization capabilities with a modern UI built using shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **File Handling**: Multer for file uploads with local storage
- **Session Management**: Express sessions with connect-pg-simple for PostgreSQL session store

### Development Setup
- **Development Server**: Custom Vite integration with Express for HMR
- **Type Checking**: Shared TypeScript configuration across client/server/shared
- **Build Process**: Vite for frontend, esbuild for backend bundling

## Key Components

### Data Models (Schema)
Located in `shared/schema.ts`:
- **Files**: Stores uploaded files with metadata (category, section, file type, etc.)
- **Reasoners**: Academic tools/provers with descriptions and URLs
- **Scenarios**: Text-based scenarios and questions for robot world category

### Storage Layer
- **Interface**: IStorage abstract interface for data operations
- **Implementation**: MemStorage (in-memory storage) for development
- **Database**: Configured for PostgreSQL with Drizzle migrations

### File Management
- **Upload Directory**: `server/uploads/` for local file storage
- **Supported Types**: Images, JSON, text files, ontologies (OWL), TPTP format
- **File Size Limit**: 10MB maximum
- **Categories**: "scene-graphs" and "robot-world"

### UI Components
- **File Upload**: Modal-based upload with auto-detection of file types
- **Image Gallery**: Grid-based image viewer with preview and download
- **Search Bar**: Category-specific search with filtering capabilities
- **Navigation**: Tab-based interface for different content categories

## Data Flow

### File Upload Process
1. User selects file through upload modal
2. Frontend sends multipart form data to `/api/files`
3. Multer processes file and saves to upload directory
4. File metadata stored in database via storage layer
5. Frontend refetches file list and updates UI

### Data Fetching
1. React Query handles API calls with automatic caching
2. Custom `apiRequest` utility for standardized HTTP requests
3. Error handling with toast notifications
4. Real-time UI updates through query invalidation

### Search and Filtering
1. Search queries sent to backend with category/section filters
2. Backend performs text matching on file names and metadata
3. Results returned and cached by React Query
4. UI updates immediately with filtered results

## External Dependencies

### Database
- **Drizzle ORM**: Type-safe database operations
- **Neon Database**: Serverless PostgreSQL provider
- **Database URL**: Required environment variable for connection

### UI Framework
- **Radix UI**: Headless component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Development Tools
- **Vite**: Frontend build tool with HMR
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing with Tailwind
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public/`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Static Assets**: Served by Express in production

### Environment Configuration
- **Development**: Vite dev server with Express API proxy
- **Production**: Single Express server serving both API and static files
- **Database**: Requires `DATABASE_URL` environment variable

### File Storage
- **Development**: Local filesystem in `server/uploads/`
- **Production**: Currently local storage (could be extended to cloud storage)

### Session Management
- **Development**: In-memory sessions
- **Production**: PostgreSQL-backed sessions via connect-pg-simple

The application is designed to be easily deployable on platforms like Replit, with automatic database provisioning and file upload handling. The modular architecture allows for easy extension to cloud storage providers and additional data sources.