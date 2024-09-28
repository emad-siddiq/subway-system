import { Pool } from 'pg';

export const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'subway_system',
    password: 'password',
    port: 5432,
});


