import request from 'supertest';
import app from '../app';
import { client } from './setup';
import { getRoute } from '../services/routeService';

jest.mock('../services/routeService');

describe('Route API', () => {
  beforeEach(async () => {
    await client.query(`
      INSERT INTO train_lines (name, fare) VALUES ('Test Line', 2.5);
      INSERT INTO stations (name) VALUES ('Station A'), ('Station B'), ('Station C');
      INSERT INTO train_line_stations (train_line_id, station_id, order_index)
      VALUES (1, 1, 0), (1, 2, 1), (1, 3, 2);
    `);
  });

  it('should get the optimal route between two stations', async () => {
    (getRoute as jest.Mock).mockResolvedValue(['Station A', 'Station B', 'Station C']);

    const response = await request(app)
      .get('/route')
      .query({ origin: 'Station A', destination: 'Station C' });

    expect(response.status).toBe(200);
    expect(response.body.route).toEqual(['Station A', 'Station B', 'Station C']);
  });

  it('should return 404 when no route is found', async () => {
    (getRoute as jest.Mock).mockResolvedValue([]);

    const response = await request(app)
      .get('/route')
      .query({ origin: 'Station A', destination: 'Non-existent Station' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'No route found');
  });

  it('should return 400 when origin or destination is missing', async () => {
    const response = await request(app)
      .get('/route')
      .query({ origin: 'Station A' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/is required/);
  });

  it('should return 500 when an error occurs in the service', async () => {
    (getRoute as jest.Mock).mockRejectedValue(new Error('Service error'));

    const response = await request(app)
      .get('/route')
      .query({ origin: 'Station A', destination: 'Station C' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Service error');
  });
});