import request from 'supertest';
import app from '../app';
import { client } from './setup';

describe('Train Line API', () => {
  it('should create a new train line', async () => {
    const response = await request(app)
      .post('/train-line')
      .send({
        name: 'Test Line',
        stations: ['Station A', 'Station B', 'Station C'],
        fare: 2.5
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Line');
    expect(response.body.stations).toHaveLength(3);
    expect(response.body.fare).toBe(2.5);

    const result = await client.query('SELECT * FROM train_lines WHERE name = $1', ['Test Line']);
    expect(result.rows.length).toBe(1);
    expect(parseFloat(result.rows[0].fare)).toBe(2.5);
  });

  it('should not create a train line with invalid data', async () => {
    const response = await request(app)
      .post('/train-line')
      .send({
        name: 'Invalid Line',
        stations: ['Only One Station'],
        fare: -1
      });

    expect(response.status).toBe(400);
  });
});