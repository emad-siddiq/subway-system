import { Client } from 'pg';
import { pool } from '../db';
import fs from 'fs';
import path from 'path';

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
    
    // Read and execute init.sql
    const initSqlPath = path.join(__dirname, '..', 'db', 'init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    await client.query(initSql);
    
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
export { client }