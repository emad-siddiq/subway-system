import { QueryResultRow } from 'pg';

export interface Card extends QueryResultRow {
  id: number;
  number: string;
  balance: string; // PostgreSQL DECIMAL type is returned as a string
}

export interface Station extends QueryResultRow {
  id: number;
  name: string;
}

export interface TrainLine extends QueryResultRow {
  id: number;
  name: string;
  fare: string; // PostgreSQL DECIMAL type is returned as a string
}

export interface Ride extends QueryResultRow {
  id: number;
  cardId: number;
  entryStationId: number;
  exitStationId?: number;
  entryTime: Date;
  exitTime?: Date;
  fare?: string; // PostgreSQL DECIMAL type is returned as a string
}

export interface TrainLineStation extends QueryResultRow {
  id: number;
  trainLineId: number;
  stationId: number;
  orderIndex: number;
}