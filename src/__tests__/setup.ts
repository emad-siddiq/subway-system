import { Client } from 'pg';
import { pool } from '../db'; 

let client: Client;

beforeAll(async () => {
  // Create a new client for tests
  client = new Client({
    user: 'user',
    host: 'localhost',
    database: 'subway_system_test',
    password: 'password',
    port: 5433,
  });

  try {
    await client.connect();
    
    // Create tables
    await client.query(`
      DROP TABLE IF EXISTS rides;
      DROP TABLE IF EXISTS train_line_stations;
      DROP TABLE IF EXISTS stations;
      DROP TABLE IF EXISTS train_lines;
      DROP TABLE IF EXISTS cards;

      CREATE TABLE train_lines (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        fare DECIMAL(10, 2)
      );

      CREATE TABLE stations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );

      CREATE TABLE train_line_stations (
        id SERIAL PRIMARY KEY,
        train_line_id INTEGER REFERENCES train_lines(id),
        station_id INTEGER REFERENCES stations(id),
        order_index INTEGER NOT NULL,
        UNIQUE (train_line_id, station_id),
        UNIQUE (train_line_id, order_index)
      );

      CREATE TABLE cards (
        id SERIAL PRIMARY KEY,
        number VARCHAR(255) NOT NULL UNIQUE,
        balance DECIMAL(10, 2) NOT NULL
      );

      CREATE TABLE rides (
        id SERIAL PRIMARY KEY,
        card_id INTEGER REFERENCES cards(id),
        entry_station_id INTEGER REFERENCES stations(id),
        exit_station_id INTEGER REFERENCES stations(id),
        entry_time TIMESTAMP NOT NULL,
        exit_time TIMESTAMP,
        fare DECIMAL(10, 2)
      );
    `);
    
    console.log('Test database set up successfully');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
});

beforeEach(async () => {
  try {
    // Clear all tables before each test
    await client.query(`
      TRUNCATE TABLE rides, train_line_stations, stations, train_lines, cards RESTART IDENTITY CASCADE;
    `);
  } catch (error) {
    console.error('Error resetting test database:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Close the client connection
    await client.end();
    
    // If you're using a pool in your main app, close that too
    if (pool && typeof pool.end === 'function') {
      await pool.end();
    }
    
    console.log('Test database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
});

// Function to manually close connections if needed
export async function closeConnections() {
  try {
    if (client) {
      await client.end();
    }
    if (pool && typeof pool.end === 'function') {
      await pool.end();
    }
    console.log('Database connections closed manually');
  } catch (error) {
    console.error('Error closing database connections manually:', error);
  }
}

// Export the client for use in tests
export { client };