export interface Station {
    id: number;
    name: string;
  }
  
  export interface Ride {
    id: number;
    cardId: number;
    entryStationId: number;
    exitStationId?: number;
    entryTime: Date;
    exitTime?: Date;
    fare?: number;
  }