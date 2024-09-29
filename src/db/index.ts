import { Pool, QueryResult, QueryResultRow } from 'pg';

const isTest = process.env.NODE_ENV === 'test';

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: isTest ? 'subway_system_test' : 'subway_system',
  password: 'password',
  port: isTest ? 5433 : 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export { pool };

export const query = async <T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
  const client = await pool.connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
};