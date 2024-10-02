import { Request, Response } from 'express';

export const getRouteHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const origin = req.query.origin as string | undefined;
    const destination = req.query.destination as string | undefined;

    if (!origin || !destination) {
      res.status(400).json({ error: 'Origin and destination are required' });
      return;
    }

    const route = await getRoute(origin, destination);

    if (route.length === 0) {
      res.status(404).json({ error: 'No route found' });
    } else {
      res.json({ route });
    }
  } catch (error: unknown) {
    console.error('Error finding route:', error);
    
    if (error instanceof Error) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

const getRoute = async (origin: string, destination: string): Promise<string[]> => {
  const client: PoolClient = await pool.connect();
  try {
    // Fetch origin and destination station IDs directly from the database
    const { rows: originResult } = await client.query<{ id: number }>(
      'SELECT id FROM stations WHERE name = $1',
      [origin]
    );
    const { rows: destinationResult } = await client.query<{ id: number }>(
      'SELECT id FROM stations WHERE name = $1',
      [destination]
    );

    if (originResult.length === 0 || destinationResult.length === 0) {
      throw new Error('One or both stations not found');
    }

    const originId = originResult[0].id;
    const destinationId = destinationResult[0].id;

    // Fetch all connections in the system (stations that share train lines)
    const connectionsResult = await client.query<Connection>(`
      SELECT tls1.station_id as from_id, tls2.station_id as to_id
      FROM train_line_stations tls1
      JOIN train_line_stations tls2 ON tls1.train_line_id = tls2.train_line_id
      WHERE tls1.station_id != tls2.station_id
    `);

    // Create graph (adjacency list)
    const connections: Map<number, Set<number>> = new Map();
    connectionsResult.rows.forEach(row => {
      if (!connections.has(row.from_id)) connections.set(row.from_id, new Set());
      if (!connections.has(row.to_id)) connections.set(row.to_id, new Set());
      connections.get(row.from_id)!.add(row.to_id);
      connections.get(row.to_id)!.add(row.from_id); // Make it bidirectional
    });

    // Use Breadth-First Search (BFS) for route finding
    const queue: number[][] = [[originId]];
    const visited: Set<number> = new Set();

    while (queue.length > 0) {
      const path = queue.shift()!;
      const currentStationId = path[path.length - 1];

      if (currentStationId === destinationId) {
        // Return station names for the found path
        const stationNames = await client.query<{ id: number, name: string }>(
          'SELECT id, name FROM stations WHERE id = ANY($1)',
          [path]
        );
        const stationMap = new Map(stationNames.rows.map(row => [row.id, row.name]));
        return path.map(id => stationMap.get(id)!);
      }

      if (!visited.has(currentStationId)) {
        visited.add(currentStationId);
        const neighbors = connections.get(currentStationId) || new Set();
        for (const neighborId of neighbors) {
          if (!visited.has(neighborId)) {
            queue.push([...path, neighborId]);
          }
        }
      }
    }

    return []; // No route found
  } finally {
    client.release();
  }
};