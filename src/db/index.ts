import { Pool, QueryResult, QueryResultRow } from 'pg';

const isTest = process.env.NODE_ENV === 'test';

const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: isTest ? (process.env.TEST_DB_HOST || 'localhost') : (process.env.DB_HOST || 'db'),
  database: isTest ? (process.env.TEST_DB_NAME || 'subway_system_test') : (process.env.DB_NAME || 'subway_system'),
  password: process.env.DB_PASSWORD || 'password',
  port: isTest ? (parseInt(process.env.TEST_DB_PORT || '5433')) : (parseInt(process.env.DB_PORT || '5432')),
});

export {pool};

export const query = async <T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
  const client = await pool.connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
};