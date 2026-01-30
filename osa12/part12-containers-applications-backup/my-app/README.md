# My App (Full-Stack Exercise 3.1-3.22) Containerization

## Docker Compose Environments

### Development (`docker-compose.dev.yml`)
Runs the application in development mode with hot-reloading enabled. The frontend runs Vite dev server on port 5173, and backend runs with nodemon for automatic restarts. Source code is mounted as volumes, so changes are reflected immediately without rebuilding. Nginx reverse proxy routes requests and enables WebSocket support for hot module replacement.
MongoDB uses a local container as its database.

**Run with:** `docker compose -f docker-compose.dev.yml up --build`

### Production (`docker-compose.yml`)
Runs the optimized production build. The frontend is built into static files and served directly by nginx from the Frontend Dockerfile (multi-stage build), eliminating the need for a separate frontend container at runtime. Backend runs in production mode with dependencies optimized. Only 3 containers run: nginx (serves frontend + proxies API), backend, and MongoDB.
MongoDB uses a production database in Atlas. Use the .env.template file to add your MongoDB URL into it.

**Run with:** `docker compose -f docker-compose.yml up --build`
