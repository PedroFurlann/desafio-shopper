import { RideEvaluator } from '../../domain/shopper/application/evaluator/rideEvaluator';
import axios from 'axios';
import { EnvService } from '../env/env.service';

export class MapsEvaluator implements RideEvaluator {
  constructor(private readonly envService: EnvService) {}

  async getGeocodeAddress(address: string) {
    const apiKey = this.envService.get('GOOGLE_API_KEY');

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const { data } = await axios.get(url);

    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  }

  async getRoute(customerId: string, origin: string, destination: string) {
    const originCoords = await this.getGeocodeAddress(origin);
    const destinationCoords = await this.getGeocodeAddress(destination);

    const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

    const body = {
      origin: {
        location: {
          latLng: {
            latitude: originCoords.lat,
            longitude: originCoords.lng,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destinationCoords.lat,
            longitude: destinationCoords.lng,
          },
        },
      },
      travelMode: 'DRIVE',
    };

    const apiKey = this.envService.get('GOOGLE_API_KEY');

    const { data } = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline',
      },
    });

    return {
      origin: {
        latitude: originCoords.lat,
        longitude: originCoords.lng,
      },
      destination: {
        latitude: originCoords.lat,
        longitude: originCoords.lng,
      },
      distance: data.routes[0]?.distanceMeters,
      duration: data.routes[0]?.duration?.slice(0, -1),
      routeResponse: data,
    };
  }
}
