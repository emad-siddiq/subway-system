import { Pool, PoolClient } from 'pg';

interface Station {
  id: number;
  name: string;
}

interface Connection {
  from_id: number;
  to_id: number;
}

export const getRoute = async (origin: string, destination: string): Promise<string[]> => {
  const pool: Pool = new Pool(); // Assuming you're using a pg Pool
  const client: PoolClient = await pool.connect();
  try {
    // Fetch all stations and connections
    const stationsResult = await client.query<Station>('SELECT id, name FROM stations');
    const connectionsResult = await client.query<Connection>(`
      SELECT tls1.station_id as from_id, tls2.station_id as to_id
      FROM train_line_stations tls1
      JOIN train_line_stations tls2 ON tls1.train_line_id = tls2.train_line_id
      WHERE tls1.station_id != tls2.station_id
    `);

    // Create a graph representation
    const stations: Map<number, string> = new Map(stationsResult.rows.map(row => [row.id, row.name]));
    const connections: Map<number, Set<number>> = new Map();
    connectionsResult.rows.forEach(row => {
      if (!connections.has(row.from_id)) connections.set(row.from_id, new Set());
      connections.get(row.from_id)!.add(row.to_id);
    });

    // Breadth-First Search
    const queue: number[][] = [[getStationIdByName(origin, stations)]];
    const visited: Set<number> = new Set();

    while (queue.length > 0) {
      const path = queue.shift()!;
      const stationId = path[path.length - 1];

      if (stations.get(stationId) === destination) {
        return path.map(id => stations.get(id)!);
      }

      if (!visited.has(stationId)) {
        visited.add(stationId);
        const neighbors = connections.get(stationId) || new Set();
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

const getStationIdByName = (name: string, stations: Map<number, string>): number => {
  for (const [id, stationName] of stations) {
    if (stationName === name) return id;
  }
  throw new Error(`Station not found: ${name}`);
};