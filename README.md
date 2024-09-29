
# Subway System API

This project implements a RESTful API for a subway system, allowing for management of train lines, stations, cards, and rides.

## Table of Contents

- [Subway System API](#subway-system-api)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
  - [Running Tests](#running-tests)
  - [API Endpoints](#api-endpoints)
    - [Challenge 1 Endpoints](#challenge-1-endpoints)
      - [Create a new train line](#create-a-new-train-line)
      - [Get the optimal route between two stations](#get-the-optimal-route-between-two-stations)
    - [Challenge 2 Endpoints](#challenge-2-endpoints)
      - [Create a new train line (with fare)](#create-a-new-train-line-with-fare)
      - [Create or update a card](#create-or-update-a-card)
      - [Enter a station](#enter-a-station)
      - [Exit a station](#exit-a-station)
  - [Docker Deployment](#docker-deployment)
  - [Creating Standalone Binaries](#creating-standalone-binaries)
  - [License](#license)

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Docker and Docker Compose
- PostgreSQL (v13 or later, if not using Docker)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/subway-system.git
   cd subway-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Database Setup

This project uses Docker Compose to set up the databases. The `docker-compose.yml` file defines two PostgreSQL services:

1. `db`: The main application database
   - Database Name: `subway_system`
   - Port: 5432

2. `test_db`: The test database
   - Database Name: `subway_system_test`
   - Port: 5433

To set up the databases:

1. Ensure Docker and Docker Compose are installed on your system.

2. From the project root, run:
   ```
   docker-compose up -d
   ```

This command will create and start both database services.

## Running the Application

1. Start the server in development mode:
   ```
   npm run dev
   ```

2. For production, build and start:
   ```
   npm run build
   npm start
   ```

The server will start on `http://localhost:3000` (or the port specified in your environment).

## Running Tests

To run the tests:

```
npm test
```

This will:
1. Connect to the `subway_system_test` database
2. Set up the necessary tables for testing
3. Run the tests
4. Clean up the test database after tests complete

Note: Ensure the Docker Compose services are running before executing tests.

## API Endpoints

### Challenge 1 Endpoints

#### Create a new train line
- **POST** `/train-line`
- **Body**:
  ```json
  {
    "name": "Blue Line",
    "stations": ["Station A", "Station B", "Station C"]
  }
  ```
- **Sample curl request**:
  ```
  curl -X POST http://localhost:3000/train-line \
  -H "Content-Type: application/json" \
  -d '{"name":"Blue Line","stations":["Station A","Station B","Station C"]}'
  ```

#### Get the optimal route between two stations
- **GET** `/route?origin=Station%20A&destination=Station%20C`
- **Sample curl request**:
  ```
  curl "http://localhost:3000/route?origin=Station%20A&destination=Station%20C"
  ```

### Challenge 2 Endpoints

#### Create a new train line (with fare)
- **POST** `/train-line`
- **Body**:
  ```json
  {
    "name": "Blue Line",
    "stations": ["Station A", "Station B", "Station C"],
    "fare": 2.75
  }
  ```
- **Sample curl request**:
  ```
  curl -X POST http://localhost:3000/train-line \
  -H "Content-Type: application/json" \
  -d '{"name":"Blue Line","stations":["Station A","Station B","Station C"],"fare":2.75}'
  ```

#### Create or update a card
- **POST** `/card`
- **Body**:
  ```json
  {
    "number": "1234567890",
    "amount": 50.00
  }
  ```
- **Sample curl request**:
  ```
  curl -X POST http://localhost:3000/card \
  -H "Content-Type: application/json" \
  -d '{"number":"1234567890","amount":50.00}'
  ```

#### Enter a station
- **POST** `/station/:station/enter`
- **Body**:
  ```json
  {
    "card_number": "1234567890"
  }
  ```
- **Sample curl request**:
  ```
  curl -X POST http://localhost:3000/station/Station%20A/enter \
  -H "Content-Type: application/json" \
  -d '{"card_number":"1234567890"}'
  ```

#### Exit a station
- **POST** `/station/:station/exit`
- **Body**:
  ```json
  {
    "card_number": "1234567890"
  }
  ```
- **Sample curl request**:
  ```
  curl -X POST http://localhost:3000/station/Station%20B/exit \
  -H "Content-Type: application/json" \
  -d '{"card_number":"1234567890"}'
  ```

## Docker Deployment

To deploy the entire application (including databases) using Docker:

1. Build the application Docker image:
   ```
   docker build -t subway-system .
   ```

2. Run the entire stack:
   ```
   docker-compose up -d
   ```

This will start the PostgreSQL databases and your application.

## Creating Standalone Binaries

To create standalone binaries for different platforms:

1. Install `pkg` globally:
   ```
   npm install -g pkg
   ```

2. Build your TypeScript project:
   ```
   npm run build
   ```

3. Generate the binaries:
   ```
   pkg . --out-path=./bin
   ```

This will create standalone executables for Linux, macOS, and Windows in a bin directory in your project root.
Run the binary for your system.

## License

Shield: [![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg

