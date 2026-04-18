export interface NPSImage {
  credit: string;
  title: string;
  altText: string;
  caption: string;
  url: string;
}

export interface NPSActivity {
  id: string;
  name: string;
}

export interface NPSOperatingHours {
  exceptions: unknown[];
  description: string;
  standardHours: {
    wednesday: string;
    monday: string;
    thursday: string;
    sunday: string;
    tuesday: string;
    friday: string;
    saturday: string;
  };
  name: string;
}

export interface NPSEntranceFee {
  cost: string;
  description: string;
  title: string;
}

export interface NPSAddress {
  postalCode: string;
  city: string;
  stateCode: string;
  countryCode: string;
  provinceTerritoryCode: string;
  line1: string;
  type: string;
  line3: string;
  line2: string;
}

export interface NPSPark {
  id: string;
  url: string;
  fullName: string;
  parkCode: string;
  description: string;
  latitude: string;
  longitude: string;
  latLong: string;
  activities: NPSActivity[];
  topics: NPSActivity[];
  states: string;
  contacts: {
    phoneNumbers: unknown[];
    emailAddresses: unknown[];
  };
  entranceFees: NPSEntranceFee[];
  entrancePasses: NPSEntranceFee[];
  fees: unknown[];
  directionsInfo: string;
  directionsUrl: string;
  operatingHours: NPSOperatingHours[];
  addresses: NPSAddress[];
  images: NPSImage[];
  weatherInfo: string;
  name: string;
  designation: string;
}

export interface NPSApiResponse {
  total: string;
  limit: string;
  start: string;
  data: NPSPark[];
}

export interface Visit {
  parkCode: string;
  dates: string[];
  notes: string;
}

export interface TrackerState {
  visits: Record<string, Visit>;
  wishlist: string[];
}
