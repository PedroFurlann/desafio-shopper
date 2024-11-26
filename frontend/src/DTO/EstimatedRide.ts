import { Driver } from "./Driver";

export interface EstimatedRide {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: Driver[]
  routeResponse: unknown;
}
