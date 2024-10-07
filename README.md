# Subway System Challenge

This project implements a RESTful API for a subway system, addressing two main challenges: route planning and fare management.

## Prerequisites
- Node.js (v14+)
- Docker and Docker Compose

## Quick Start
1. Clone the repository:
   ```
   git clone https://github.com/emad-siddiq/subway-system.git
   cd subway-system
   ```

2. Build and start the application using Docker:
   ```
   docker-compose up --build
   ```

   This will start both the backend service and the PostgreSQL database.

3. The server will be running on `http://localhost:3000`

## Development Mode
To run the application in development mode:

```
NODE_ENV=development docker-compose up
```

This will start the application using `ts-node-dev`, which will watch for file changes and automatically restart the server.

## Testing
Run tests:
```
npm test
```

## Uninstall

To stop the application and remove the containers, volumes, and images:

```
docker-compose down -v --rmi all
```

## Project Structure
```
.
├── src/
│   ├── controllers/
│   ├── db/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.ts
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables
The application uses the following environment variables:

- `NODE_ENV`: Set to 'development' or 'production'
- `DB_HOST`: Database host (default: 'db')
- `DB_USER`: Database user (default: 'user')
- `DB_PASSWORD`: Database password (default: 'password')
- `DB_NAME`: Database name (default: 'subway_system')
- `DB_NAME_TEST`: Test database name (default: 'subway_system_test')
- `DB_PORT`: Database port (default: 5432)
- `DB_PORT_TEST`: Test database port (default: 5433)

These can be set in the `docker-compose.yml` file or as environment variables when running the application.

## Challenge 1: Route Planning

### Create a Train Line
```bash
curl -X POST http://localhost:3000/train-line \
  -H "Content-Type: application/json" \
  -d '{"name": "1", "stations": ["Canal", "Houston", "Christopher", "14th"]}'
```

### Get Optimal Route
```bash
curl "http://localhost:3000/route?origin=Houston&destination=23rd"
```

## Challenge 2: Fare Management

### Create a Train Line with Fare
```bash
curl -X POST http://localhost:3000/train-line \
  -H "Content-Type: application/json" \
  -d '{"name": "A", "stations": ["Canal", "Houston", "West 4th", "14th"], "fare": 2.75}'
```

### Create or Update Card
```bash
curl -X POST http://localhost:3000/card \
  -H "Content-Type: application/json" \
  -d '{"number": "1234", "amount": 20.00}'
```

### Enter Station
```bash
curl -X POST http://localhost:3000/station/Houston/enter \
  -H "Content-Type: application/json" \
  -d '{"card_number": "1234"}'
```

### Exit Station
```bash
curl -X POST http://localhost:3000/station/14th/exit \
  -H "Content-Type: application/json" \
  -d '{"card_number": "1234"}'
```

## Implementation Details

- Language: TypeScript
- Database: PostgreSQL
- Containerization: Docker

## Creating Standalone Binaries

To create standalone executables for different platforms:

1. Install `pkg` globally:
   ```
   npm install -g pkg
   ```

2. Build the TypeScript project:
   ```
   npm run build
   ```

3. Generate the binaries:
   ```
   pkg . --out-path=./bin
   ```

This will create standalone executables for Linux, macOS, and Windows in the `bin` directory. Run the appropriate binary for your system.

Note: When running the standalone binary, you'll need to ensure that a PostgreSQL database is available and the correct environment variables are set for the database connection.