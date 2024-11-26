![Version](https://img.shields.io/badge/version-0.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)


# Long Habit

Long Habit is a simple CRUD application for tracking long-term habits and recurring tasks. It is a production-ready full-stack project built using PocketBase and React. This is a comprehensive example of integrating PocketBase into a larger Go project and combining it with a modern React frontend using best practices. The application is very simple and can be used as a template for starting new projects. Most of the boilerplate setup has been taken care of and common issues have been identified and fixed.

Try the live version: https://longhabit.com

## ✨ Key Features

### Backend Architecture
- Running the latest version of Pocketbase (v0.23).
- Single-binary build. Uses Go's "embed" package to embed the React front-end as a file system inside the compiled binary.
- PocketBase is installed as a Go package and used as a framework. The project makes use of many extension features including:
  - Custom hooks and middleware
  - Route binding
  - Database operations
  - Scheduled tasks with cron
  - HTML email templates
  - Custom logging configuration
- Worker pool implementation for bulk email processing done using the Pond library
- Idiomatic Go code organization with clean separation of concerns

### Frontend Implementation
- Modern React setup with TypeScript and Vite.
- Ready for React 19. Works well with React 19 RC and React Compiler enabled.
- TailwindCSS with ShadCN UI fully configured with a custom theme.
- Responsive design using all the best practices. Supports light and dark mode. Tested on desktop and mobile screens.
- Complete authentication flow with customized forms. Works with email + password auth as well as Google OAuth.
- TanStack Router configured using best practices. The Javascript bundle is split and lazy loaded based on route. All the authentication logic and data fetching happens in the router before the pages are loaded. Dynamic page title switching based on route.
- TanStack Query fully integrated with PocketBase and TanStack Router. Fresh data is fetched from the backend and loaded before the routes are rendered. TanStack Query takes care of data fetching and ensures that client-side state is up to date with server-side data.
- Loading states are implemented using the new React Suspense boundaries. 
- Dynamic forms with validation and error messages implemented using React Hook Form and Zod.
- SEO stuff like sitemap.xml and robots.txt added and configured. Exclude rule for the PocketBase admin "/_" URL added to prevent it from being indexed by crawlers.

### Developer Experience
- Vite dev mode with hot reload works seamlessly with PocketBase. No need to wait for PocketBase to compile. Vite and PocketBase proxy requests to and from each other while running on different ports.
- Fully working ESlint configuration written in the new ESlint 9 format. Includes all the relevant plugins for React, Tailwind and Prettier. 
- Single-command production builds.
- Run project locally in Docker Compose without additional configuration.
- Compatible with any Node.js runtime (default: Bun).

### Deployment
- Compile into a single executable binary or deploy using Docker containers.
- Fully containerized, all the build steps happen in a multi-stage Dockerfile. Outputs a slim Alpine container that contains only the compiled binary.
- Docker Compose deployment that works out of the box. Working health check endpoint included.
- Ready for deployment on Coolify and similar platforms.

## 🛠️ Tech Stack

- **Frontend**
  - [TypeScript](https://www.typescriptlang.org/docs/) - Frontend language
  - [React 19](https://react.dev/blog/2024/04/25/react-19) - Frontend framework
  - [Vite](https://vite.dev/guide/) - Build tool
  - [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview) - Router
  - [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) - Data fetching and state management
  - [TanStack Table](https://tanstack.com/table/latest/docs/introduction) - Table / data grid library
  - [React Hook Form](https://www.react-hook-form.com/api/) - Forms library for React
  - [ShadCN UI](https://ui.shadcn.com/docs) - React components library based on TailwindCSS and Radix UI
  - [TailwindCSS](https://tailwindcss.com/docs/installation) - Utility-first CSS framework
  - [Zod](https://zod.dev/?id=table-of-contents) - Typescript schema validation
  - [Date-fns](https://date-fns.org/docs/Getting-Started) - Date manipulation library
- **Backend**
  - [Go 1.23](https://go.dev/doc/) - Backend language
  - [PocketBase](https://pocketbase.io/docs/) - Backend framework
  - [Pond](https://github.com/alitto/pond) - Worker pool implementation in Go
- **Deployment**
  - [Docker](https://docs.docker.com/reference/) - Containerization tool
  - [Coolify](https://coolify.io/docs) - Open source hosting platform

## 🚦 Getting Started

### Prerequisites
- Go 1.23+
- Node.js 18+ or Bun
- Docker (optional)

### Local Development

- Clone the repository `git clone https://github.com/s-petr/longhabit`
- Install dependencies `npm install --force` or `bun install`. The `--force` tag is required for npm to install React 19 RC. This is a temporary fix and won't be needed in the future.
- Start development servers `npm run dev` or `bun run dev`
 
### Production Build

- Build frontend and backend `npm run build` or `bun run build`
- Run the compiled binary `./longhabit serve`

### Docker Deployment
- Build and run with Docker Compose `npm run compose` or `bun run compose`

### Post-deployment actions
- Once the PocketBase backend is up and running you need to import collections from the file [backend/pb_schema.json](backend/pb_schema.json) by going to the PocketBase dashboard Settings -> Import collections
- A folder `/db` will be created in the root directory. This will contain the database files. Docker Compose has been configured with a volume to read/write data to the same folder. You may need to adjust file permissions for this folder if PocketBase cannot write to it from the Docker container.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.