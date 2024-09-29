export interface Ride {
    id: number;
    cardId: number;
    entryStationId: number;
    exitStationId?: number;
    entryTime: Date;
    exitTime?: Date;
    fare?: number;
  }