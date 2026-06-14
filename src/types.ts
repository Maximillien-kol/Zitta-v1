export interface Property {
  id: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  address: string;
  mlsId: string;
  agent: string;
  badgeText?: string;
  badgeType?: 'orange' | 'red';
  image: string;
}

export interface SearchProperty {
  id: string;
  price: number;
  address: string;
  bedrooms: number;
  rooms: number;
  sqft: number;
  images: string[];
  lat: number;
  lng: number;
}
