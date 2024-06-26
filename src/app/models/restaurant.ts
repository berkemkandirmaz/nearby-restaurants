export interface Restaurant {
  id: string;
  title: string;
  text: string;
  type: string;
  images: Image[];
  location: {
    type: string;
    coordinates: number[];
  };
  isDinner: boolean;
  isDelivery: boolean;
  storeInfo: {
    id: string;
    geoLocation: {
      approve: boolean;
      latitude: number;
      longitude: number;
    };
    userPoint: number;
    workingHours: {
      day: number;
      open: string;
      close: string;
      closed: boolean;
    }[];
    status: string;
    rate: number;
    minOrderPrice: number;
  };
  categoryId: string;
  distance?: number;
  isOpen?: boolean;
}

export interface Image {
  itemType: string;
  itemId: string;
  imageSize: string;
  base64: string;
  storeId: string;
}
