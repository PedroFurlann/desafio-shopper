export interface GetRouteResponse {
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
  routeResponse: any;
}

export abstract class RideEvaluator {
  abstract getGeocodeAddress(
    address: string,
  ): Promise<{ lat: number; lng: number }>;
  abstract getRoute(
    customerId: string,
    origin: string,
    destination: string,
  ): Promise<GetRouteResponse>;
}
