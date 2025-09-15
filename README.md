# Student Reading Speed Tracker

## Overview

This is a teacher dashboard application for tracking and monitoring student reading progress. The system allows educators to record reading test results, visualize student progress over time, and manage student information. Teachers can input Words Per Minute (WPM) scores for individual students, view detailed progress charts, and analyze reading improvement trends. The application provides a clean, educational-focused interface inspired by tools like Google Classroom and Notion, emphasizing efficiency and ease of use for educators.

## Key Features

- **Student Management**: Add, view, and organize students with grade-level filtering.
- **Test Recording**: Intuitive WPM input with date selection and immediate feedback.
- **Progress Tracking**: Visual charts showing reading speed improvement over time.
- **Sorting and Filtering**: Multiple sorting options (last tested, best/worst progress, alphabetical).
- **Responsive Design**: Mobile-optimized interface with touch-friendly controls.

## Getting Started

### Prerequisites

- Node.js and npm
- A PostgreSQL database

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd <project-directory>
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Database Setup

After setting up your PostgreSQL database, you can use the provided DDL script to create the necessary tables. Connect to your database and execute the script:

```bash
psql -d your-database-name -f setup.sql
```

Replace `your-database-name` with the name of your database. This will create the `students` and `reading_tests` tables.

Alternatively, you can use the `db:push` command to let Drizzle manage the schema based on the definitions in `shared/schema.ts`:

```bash
npm run db:push
```

### Environment Variables

Before running the application, you need to set up your environment variables. Create a `.env` file in the root of the project and add the following variables.

-   `DB_TYPE`: Specifies the database implementation to use.
    -   `postgres` (default): Uses a PostgreSQL database.
    -   `in-memory`: Uses a temporary, in-memory database with pre-seeded sample data.
-   `DATABASE_URL`: The connection string for your PostgreSQL database. This is only required if `DB_TYPE` is set to `postgres`.

Example `.env` file for PostgreSQL:
```
DB_TYPE=postgres
DATABASE_URL="your-postgresql-database-url"
```

Example `.env` file for the in-memory database:
```
DB_TYPE=in-memory
```

### Running the Project

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start the development server for both the frontend and backend. You can access the application at `http://localhost:5000`.

You can also specify the database type directly on the command line, which will override the `DB_TYPE` setting in your `.env` file:
```bash
# Run the dev server with the in-memory database
npm run dev -- --db-type=in-memory

# Run the production build with the in-memory database
npm run start -- --db-type=in-memory
```

## Running with Docker

You can also run the entire application stack using Docker and Docker Compose.

### Prerequisites

- Docker
- Docker Compose

### Setup

1.  **Environment Variables for Database:**
    The `docker-compose.yml` file is configured to use default values for the PostgreSQL database connection. If you want to override them, create a `.env` file in the project root and add the following variables:
    ```
    POSTGRES_USER=myuser
    POSTGRES_PASSWORD=mypassword
    POSTGRES_DB=mydatabase
    ```

2.  **Build and Run:**
    Build and start the services in detached mode:
    ```bash
    docker-compose up -d --build
    ```
    The application will be available at `http://localhost:5000`.

3.  **Database Initialization:**
    Once the containers are running, you need to set up the database schema. You can do this by executing the `setup.sql` script inside the `db` container.

    First, find the container ID for the database service:
    ```bash
    docker ps
    ```

    Then, execute the setup script using `docker exec`:
    ```bash
    docker exec -i <db-container-id> psql -U ${POSTGRES_USER:-user} -d ${POSTGRES_DB:-db} < setup.sql
    ```

    Alternatively, you can run the `db:push` command inside the `app` container to have Drizzle initialize the schema:
    ```bash
    docker-compose exec app npm run db:push
    ```

### Stopping the Application

To stop the services, run:
```bash
docker-compose down
```

## Available Scripts

- `npm run dev`: Starts the application in development mode.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run check`: Runs the TypeScript compiler to check for errors.
- `npm run db:push`: Pushes database schema changes using Drizzle Kit.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom design system featuring educational-focused color palette and typography
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture

- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints for CRUD operations on students and reading tests
- **Error Handling**: Centralized error handling middleware with structured JSON responses

### Database Schema

- **Students Table**: Stores student information (id, name, grade) with UUID primary keys
- **Reading Tests Table**: Records test results (id, student_id, words_per_minute, test_date) with foreign key relationships
- **Database Provider**: PostgreSQL via Neon Database with connection pooling
- **Migrations**: Drizzle Kit for schema migrations and database management

## Dependencies

A detailed list of dependencies can be found in the `package.json` file. Key dependencies include:

### Core Framework Dependencies

- **@vitejs/plugin-react**: React integration for Vite build system
- **wouter**: Lightweight routing library for single-page application navigation
- **@tanstack/react-query**: Server state management and data synchronization

### UI and Design System

- **@radix-ui/react-***: Comprehensive set of accessible UI primitives (dialogs, dropdowns, forms, etc.)
- **tailwindcss**: Utility-first CSS framework with custom design tokens
- **class-variance-authority**: Type-safe component variant management
- **lucide-react**: Consistent icon library for UI elements

### Database and Backend

- **@neondatabase/serverless**: PostgreSQL database connection with serverless compatibility
- **drizzle-orm**: Type-safe ORM with PostgreSQL adapter
- **drizzle-kit**: Database migration and schema management tools

### Form and Validation

- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Integration layer for external validation libraries
- **zod**: TypeScript-first schema validation shared across frontend and backend

### Data Visualization

- **recharts**: React charting library for progress visualization and trend analysis

### Development and Build Tools

- **typescript**: Static type checking across the entire application
- **vite**: Fast development server and optimized production builds
- **tsx**: TypeScript execution for Node.js development
- **esbuild**: Fast bundling for production server builds
