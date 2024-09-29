import request from 'supertest';
import app from '../app';
import { pool } from '../db';

describe('Card API', () => {
  beforeEach(async () => {
    await pool.query('BEGIN');
  });

  afterEach(async () => {
    await pool.query('ROLLBACK');
  });

  it('should create a new card', async () => {
    const response = await request(app)
      .post('/card')
      .send({
        number: '1234567890',
        amount: 50
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.number).toBe('1234567890');
    expect(parseFloat(response.body.balance)).toBe(50);

    const result = await pool.query('SELECT * FROM cards WHERE number = $1', ['1234567890']);
    expect(result.rows.length).toBe(1);
    expect(parseFloat(result.rows[0].balance)).toBe(50);
  });

  it('should update an existing card', async () => {
    // First, create a card
    await request(app)
      .post('/card')
      .send({
        number: '1234567890',
        amount: 50
      });

    // Then, update it
    const response = await request(app)
      .post('/card')
      .send({
        number: '1234567890',
        amount: 25
      });

    expect(response.status).toBe(201);
    expect(response.body.number).toBe('1234567890');
    expect(parseFloat(response.body.balance)).toBe(75);

    const result = await pool.query('SELECT * FROM cards WHERE number = $1', ['1234567890']);
    expect(result.rows.length).toBe(1);
    expect(parseFloat(result.rows[0].balance)).toBe(75);
  });
});