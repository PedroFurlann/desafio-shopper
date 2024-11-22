import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { Optional } from '../../../../core/types/optional';

export interface RideProps {
  customerId: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driverId: number;
  driverName: string;
  value: number;
  updatedAt?: Date | null;
  createdAt: Date;
}

export class Ride extends Entity<RideProps> {
  get customerId() {
    return this.props.customerId;
  }

  set customerId(newcustomerId: string) {
    this.props.customerId = newcustomerId;
    this.touch();
  }

  get destination() {
    return this.props.destination;
  }

  set destination(destination: string) {
    this.props.destination = destination;
    this.touch();
  }

  get origin() {
    return this.props.origin;
  }

  set origin(origin: string) {
    this.props.origin = origin;
    this.touch();
  }

  get distance() {
    return this.props.distance;
  }

  set distance(distance: number) {
    this.props.distance = distance;
    this.touch();
  }

  get duration() {
    return this.props.duration;
  }

  set duration(duration: string) {
    this.props.duration = duration;
    this.touch();
  }

  get driverId() {
    return this.props.driverId;
  }

  set driverId(driverId: number) {
    this.props.driverId = driverId;
    this.touch();
  }

  get driverName() {
    return this.props.driverName;
  }

  set driverName(driverName: string) {
    this.props.driverName = driverName;
    this.touch();
  }

  get value() {
    return this.props.value;
  }

  set value(value: number) {
    this.props.value = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<RideProps, 'createdAt'>, id?: UniqueEntityID) {
    const ride = new Ride(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return ride;
  }
}
