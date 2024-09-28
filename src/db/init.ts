import { pool } from './index';

const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS train_lines (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        fare DECIMAL(10, 2)
      );

      CREATE TABLE IF NOT EXISTS stations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS train_line_stations (
        id SERIAL PRIMARY KEY,
        train_line_id INTEGER REFERENCES train_lines(id),
        station_id INTEGER REFERENCES stations(id),
        order_index INTEGER NOT NULL,
        UNIQUE (train_line_id, station_id),
        UNIQUE (train_line_id, order_index)
      );

      CREATE TABLE IF NOT EXISTS cards (
        id SERIAL PRIMARY KEY,
        number VARCHAR(255) NOT NULL UNIQUE,
        balance DECIMAL(10, 2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS rides (
        id SERIAL PRIMARY KEY,
        card_id INTEGER REFERENCES cards(id),
        entry_station_id INTEGER REFERENCES stations(id),
        exit_station_id INTEGER REFERENCES stations(id),
        entry_time TIMESTAMP NOT NULL,
        exit_time TIMESTAMP,
        fare DECIMAL(10, 2)
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
};

initDb();