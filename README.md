
# LinkedIn Automation Platform

A full-stack web application for LinkedIn automation built with React, Express, TypeScript, and PostgreSQL.

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   └── lib/           # Utilities and configurations
├── server/                 # Express backend
├── shared/                 # Shared TypeScript types and schemas
└── migrations/            # Database migrations
```

## Prerequisites

- Node.js 20+ (automatically provided in Replit)
- PostgreSQL database (automatically provisioned in Replit)

## Setup Instructions

### Step 1: Fork the Project

1. Click the **Fork** button in the top-right corner of this Repl
2. Wait for the project to be copied to your workspace

### Step 2: Install Dependencies

Dependencies are automatically installed when you open the project in Replit. If you need to reinstall them manually:

```bash
npm install
```

### Step 3: Database Setup

1. The PostgreSQL database is automatically provisioned in Replit
2. Push the database schema:

```bash
npm run db:push
```

This will create all necessary tables using Drizzle ORM.

### Step 4: Environment Variables

The project uses Replit's built-in environment variables. The `DATABASE_URL` is automatically configured when you provision PostgreSQL.

### Step 5: Start the Development Server

Click the **Run** button in Replit, or use the command:

```bash
npm run dev
```

This starts both the frontend and backend servers:
- Frontend (React + Vite): Accessible through the webview
- Backend (Express): Running on port 5000

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check TypeScript files
- `npm run db:push` - Push database schema changes

## Development Workflow

1. **Frontend Development**: Edit files in `client/src/`
   - Pages are in `client/src/pages/`
   - Components are in `client/src/components/`
   - Styling uses Tailwind CSS

2. **Backend Development**: Edit files in `server/`
   - API routes are in `server/routes.ts`
   - Database operations are in `server/db.ts`

3. **Database Changes**: 
   - Modify schema in `shared/schema.ts`
   - Run `npm run db:push` to apply changes

## Features

- **Dashboard**: Overview of automation metrics and activity
- **Automation**: Create and manage LinkedIn automation campaigns
- **Analytics**: Performance tracking and insights
- **Connections**: Manage LinkedIn connections
- **Content**: Content management for automated posts
- **Settings**: User preferences and configuration

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Radix UI components
- Wouter for routing
- TanStack Query for data fetching

### Backend
- Express.js with TypeScript
- Drizzle ORM for database operations
- PostgreSQL database
- Express sessions for authentication

### Development Tools
- TypeScript for type safety
- ESBuild for fast compilation
- PostCSS with Autoprefixer

## Deployment

### To Replit Hosting

1. Click the **Deploy** button in the workspace
2. Choose **Autoscale** deployment
3. Configure deployment settings:
   - **Build command**: `npm run build`
   - **Run command**: `npm run start`
4. Click **Deploy**

Your app will be live on a Replit domain within minutes!

## Project Architecture

### Frontend Structure
- Uses a component-based architecture with React
- Implements a clean separation between pages and reusable components
- Utilizes a centralized state management approach with TanStack Query
- Responsive design with Tailwind CSS

### Backend Structure
- RESTful API design with Express.js
- Database abstraction layer using Drizzle ORM
- Session-based authentication
- Modular route organization

### Database Schema
- User management and authentication
- Campaign and automation tracking
- Analytics and performance metrics
- Activity logging

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is provisioned in your Repl
   - Check that `DATABASE_URL` environment variable is set
   - Run `npm run db:push` to ensure schema is up to date

2. **Build Errors**
   - Run `npm run check` to identify TypeScript errors
   - Ensure all dependencies are installed with `npm install`

3. **Port Issues**
   - The app runs on port 5000 by default
   - Replit automatically forwards this to ports 80/443 in production

### Getting Help

- Check the console logs in the Shell tab for backend errors
- Use browser developer tools to debug frontend issues
- Review the file structure to understand component relationships

## Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
