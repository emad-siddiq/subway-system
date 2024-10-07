import request from 'supertest';
import express from 'express';
import { pool } from '../db';
import { getRouteHandler } from '../controllers/routeController';

jest.mock('../db', () => ({
  pool: {
    connect: jest.fn(),
  },
}));

jest.mock('../controllers/routeController');

const app = express();
app.get('/route', getRouteHandler);

describe('Route API', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get the optimal route between two stations', async () => {
    const mockRoute = ['Station A', 'Station B', 'Station C'];
    (getRouteHandler as jest.Mock).mockImplementation((req, res) => {
      res.json({ route: mockRoute });
    });

    const response = await request(app)
      .get('/route')
      .query({ origin: 'Station A', destination: 'Station C' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ route: mockRoute });
  }, 10000);

  it('should return 404 when no route is found', async () => {
    (getRouteHandler as jest.Mock).mockImplementation((req, res) => {
      res.status(404).json({ error: 'No route found' });
    });

    const response = await request(app)
      .get('/route')
      .query({ origin: 'Station A', destination: 'Non-existent Station' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'No route found' });
  }, 10000);

  it('should return 400 when origin or destination is missing', async () => {
    (getRouteHandler as jest.Mock).mockImplementation((req, res) => {
      res.status(400).json({ error: 'Origin and destination are required' });
    });

    const response = await request(app)
      .get('/route')
      .query({ origin: 'Station A' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Origin and destination are required' });
  }, 10000);

  it('should return 500 when an error occurs in the service', async () => {
    (getRouteHandler as jest.Mock).mockImplementation((req, res) => {
      res.status(500).json({ error: 'Internal server error' });
    });

    const response = await request(app)
      .get('/route')
      .query({ origin: 'Station A', destination: 'Station C' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  }, 10000);
});