# Subway System Challenge

This project implements a RESTful API for a subway system, addressing two main challenges: route planning and fare management.

## Prerequisites
- Node.js (v16+)
- Docker and Docker Compose

## Quick Start
1. Clone and install:
   ```
   git clone https://github.com/emad-siddiq/subway-system.git
   cd subway-system
   npm install
   ```

2. Start the database:
   ```
   docker-compose -f docker/docker-compose.yml up -d
   ```

3. Run the application:
   - Development: `npm run dev`
   - Production: `npm run build && npm start`

Server runs on `http://localhost:3000`

## Testing
Run tests: `npm test`

## Challenge 1: Route Planning

### Create a Train Line
```bash
curl -X POST http://localhost:3000/train-line \
  -H "Content-Type: application/json" \
  -d '{"name": "1", "stations": ["Canal", "Houston", "Christopher", "14th"]}'
```

```bash
curl -X POST http://localhost:3000/train-line \
  -H "Content-Type: application/json" \
  -d '{"name": "E", "stations": ["Spring", "West 4th", "14th", "23rd"]}'
```

### Get Optimal Route
```bash
curl "http://localhost:3000/route?origin=Houston&destination=23rd"
```

Expected response:
```json
{
  "route": ["Houston", "Christopher", "14th", "23rd"]
}
```

This demonstrates finding the optimal route across multiple train lines.

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

```bash
# Add more money to an existing card
curl -X POST http://localhost:3000/card \
  -H "Content-Type: application/json" \
  -d '{"number": "1234", "amount": 10.00}'
```

### Enter Station
```bash
curl -X POST http://localhost:3000/station/Houston/enter \
  -H "Content-Type: application/json" \
  -d '{"card_number": "1234"}'
```

Expected response:
```json
{
  "amount": 27.25
}
```

### Exit Station
```bash
curl -X POST http://localhost:3000/station/14th/exit \
  -H "Content-Type: application/json" \
  -d '{"card_number": "1234"}'
```

Expected response:
```json
{
  "amount": 27.25
}
```

Note: The amount remains the same as the fare is deducted upon entering the station.

### Example Scenario
1. Create two train lines:
   ```bash
   curl -X POST http://localhost:3000/train-line \
     -H "Content-Type: application/json" \
     -d '{"name": "1", "stations": ["Canal", "Houston", "Christopher", "14th"], "fare": 2.75}'
   
   curl -X POST http://localhost:3000/train-line \
     -H "Content-Type: application/json" \
     -d '{"name": "E", "stations": ["Spring", "West 4th", "14th", "23rd"], "fare": 3.00}'
   ```

2. Create a card:
   ```bash
   curl -X POST http://localhost:3000/card \
     -H "Content-Type: application/json" \
     -d '{"number": "5678", "amount": 50.00}'
   ```

3. Enter and exit stations:
   ```bash
   curl -X POST http://localhost:3000/station/Houston/enter \
     -H "Content-Type: application/json" \
     -d '{"card_number": "5678"}'
   
   curl -X POST http://localhost:3000/station/23rd/exit \
     -H "Content-Type: application/json" \
     -d '{"card_number": "5678"}'
   ```

   This scenario demonstrates entering on one line and exiting on another, showing the system can handle transfers between lines.

## Implementation Details

- Language: TypeScript
- Database: PostgreSQL
- Containerization: Docker

## Project Structure
```
.
├── config/
├── docker/
├── src/
│   ├── db/
│   └── server.ts
├── package.json
└── README.md
```

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

For detailed API documentation and advanced usage, please refer to the [API Documentation](link-to-your-api-docs).