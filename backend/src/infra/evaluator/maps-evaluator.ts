import { RideEvaluator } from '../../domain/travel/application/evaluator/rideEvaluator';
import axios from 'axios';
import { EnvService } from '../env/env.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MapsEvaluator implements RideEvaluator {
  private apiKey: string;

  constructor(private readonly envService: EnvService) {
    this.apiKey = envService.get('GOOGLE_API_KEY');
  }

  async getGeocodeAddress(address: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;

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

    const { data } = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': this.apiKey,
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
