import request from 'supertest';
import app from '../app';
import { pool } from '../db';

describe('Station API', () => {
  beforeEach(async () => {
    await pool.query('BEGIN');
    await pool.query(`
      INSERT INTO train_lines (name, fare) VALUES ('Test Line', 2.75);
      INSERT INTO stations (name) VALUES ('Station A'), ('Station B');
      INSERT INTO train_line_stations (train_line_id, station_id, order_index)
      VALUES (1, 1, 0), (1, 2, 1);
      INSERT INTO cards (number, balance) VALUES ('1234567890', 100);
    `);
  });

  afterEach(async () => {
    await pool.query('ROLLBACK');
  });

  it('should allow a card to enter a station', async () => {
    const response = await request(app)
      .post('/station/Station A/enter')
      .send({
        card_number: '1234567890'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('balance');
    expect(response.body.balance).toBe(100);

    const rideResult = await pool.query('SELECT * FROM rides WHERE card_id = (SELECT id FROM cards WHERE number = $1)', ['1234567890']);
    expect(rideResult.rows.length).toBe(1);
    expect(rideResult.rows[0].entry_station_id).toBe(1);  // Assuming Station A has id 1
  });

  it('should allow a card to exit a station', async () => {
    // First, enter a station
    await request(app)
      .post('/station/Station A/enter')
      .send({
        card_number: '1234567890'
      });

    // Then, exit a station
    const response = await request(app)
      .post('/station/Station B/exit')
      .send({
        card_number: '1234567890'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('balance');
    expect(response.body.balance).toBe(97.25);  // 100 - 2.75

    const rideResult = await pool.query('SELECT * FROM rides WHERE card_id = (SELECT id FROM cards WHERE number = $1)', ['1234567890']);
    expect(rideResult.rows.length).toBe(1);
    expect(rideResult.rows[0].exit_station_id).toBe(2);  // Assuming Station B has id 2
    expect(parseFloat(rideResult.rows[0].fare)).toBe(2.75);
  });

  it('should return 404 if the card is not found when entering a station', async () => {
    const response = await request(app)
      .post('/station/Station A/enter')
      .send({
        card_number: 'nonexistent'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Card not found');
  });

  it('should return 404 if the station is not found when entering a station', async () => {
    const response = await request(app)
      .post('/station/Nonexistent Station/enter')
      .send({
        card_number: '1234567890'
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Station not found');
  });

  it('should return 400 if no open ride is found when exiting a station', async () => {
    const response = await request(app)
      .post('/station/Station B/exit')
      .send({
        card_number: '1234567890'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'No open ride found');
  });

  it('should return 400 if there is insufficient balance when exiting a station', async () => {
    // First, set the card balance to a low amount
    await pool.query('UPDATE cards SET balance = 1 WHERE number = $1', ['1234567890']);

    // Enter a station
    await request(app)
      .post('/station/Station A/enter')
      .send({
        card_number: '1234567890'
      });

    // Try to exit a station
    const response = await request(app)
      .post('/station/Station B/exit')
      .send({
        card_number: '1234567890'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Insufficient balance');
  });
});