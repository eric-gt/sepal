export interface Room {
  id?: string;
  name: string;
  lighting: {
    direction: string;
    intensity: string;
  };
  plants: Plant[];
}
export interface Collection {
  id?: string;
  userId?: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  rooms: Room[];
}
export interface Plant {
  id: string;
  collectionId?: string;
  roomId?: string;
  alert?: boolean;
  commonName: string;
  nickname: string;
  sciName: string;
  attachment: string;
  instructions: {
    water: string;
    light: {
      direction: string;
      intensity: string;
    };
  };
}

export interface FilterItem {
  id: string;
  name: string;
}

export interface NewPlantData extends Plant {
  collectionId?: string;
  roomId?: string;
  collectionName?: string;
  roomName?: string;
  roomLightingDirection?: string;
  roomLightingIntensity?: string;
}

export interface NewRoomData extends Room {
  collectionId: string;
}
