import { Property, SearchProperty } from './types';

export const mockProperties: Property[] = [
  {
    id: "1",
    price: 299000,
    beds: 3,
    baths: 2,
    sqft: 1248,
    status: "Active",
    address: "6531 McPhilmy Rd, Lowville, NY, 13367",
    mlsId: "#S1676763",
    agent: "HOMES REALTY OF NORTHERN NEW YORK, Brenda L Malone. Listing provided by NYSAMLss",
    badgeText: "Price cut: $51,000 (5/24)",
    badgeType: "orange",
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    price: 200000,
    beds: 3,
    baths: 2,
    sqft: 1531,
    status: "Active",
    address: "7568 Church St, Lowville, NY, 13367",
    mlsId: "#S1684762",
    agent: "GOOD MORNING REALTY, Carole Dunbar. Listing provided by NYSAMLss",
    badgeText: "Handicap accessible bathroom",
    badgeType: "orange",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    price: 429900,
    beds: 3,
    baths: 3,
    sqft: 2040,
    status: "Active",
    address: "3651 Gardner Rd, Lowville, NY, 13367",
    mlsId: "#S1679485",
    agent: "MARBLE KEY REALTY LLC, Cheyanne Brooks. Listing provided by NYSAMLss",
    badgeText: "Central air conditioning",
    badgeType: "orange",
    image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    price: 360000,
    beds: 3,
    baths: 2,
    sqft: 1464,
    status: "Active",
    address: "5508 Bostwick St, Lowville, NY, 13367",
    mlsId: "#S1679264",
    agent: "HOMES REALTY OF NORTHERN NEW YORK, Sarah Abbey. Listing provided by NYSAMLss",
    badgeText: "Price cut: $29,000 (5/1)",
    badgeType: "orange",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
  }
];

export const searchMockProperties: SearchProperty[] = [
  {
    id: "s1",
    price: 570000,
    address: "KN 5 Rd, Kigali, Rwanda",
    bedrooms: 2,
    rooms: 3,
    sqft: 1220,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    lat: -1.9536,
    lng: 30.0964
  },
  {
    id: "s2",
    price: 720000,
    address: "KG 7 Ave, Kigali, Rwanda",
    bedrooms: 2,
    rooms: 5,
    sqft: 1610,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80"
    ],
    lat: -1.9452,
    lng: 30.0898
  },
  {
    id: "s3",
    price: 800990,
    address: "KK 15 Rd, Kigali, Rwanda",
    bedrooms: 2,
    rooms: 5,
    sqft: 1862,
    images: [
      "https://images.unsplash.com/photo-1600607687931-570c8c0f5eb0?auto=format&fit=crop&w=800&q=80"
    ],
    lat: -1.9951,
    lng: 30.1035
  },
  {
    id: "s4",
    price: 820745,
    address: "KN 3 Ave, Kigali, Rwanda",
    bedrooms: 2,
    rooms: 6,
    sqft: 2066,
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    ],
    lat: -1.9405,
    lng: 30.0619
  }
];
