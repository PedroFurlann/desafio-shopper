import { Optional } from '../../../../core/types/optional';
import { Entity } from '../../../../core/entities/entity';
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';

export interface DriverProps {
  name: string;
  description: string;
  vehicle: string;
  tax: number;
  minKm: number;
  rating: number;
  comment: string;
  updatedAt?: Date | null;
  createdAt: Date;
}

export class Driver extends Entity<DriverProps> {
  get name() {
    return this.props.name;
  }

  set name(newName: string) {
    this.props.name = newName;
    this.touch();
  }

  get vehicle() {
    return this.props.vehicle;
  }

  set vehicle(vehicle: string) {
    this.props.vehicle = vehicle;
    this.touch();
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
    this.touch();
  }

  get tax() {
    return this.props.tax;
  }

  set tax(tax: number) {
    this.props.tax = tax;
    this.touch();
  }

  get comment() {
    return this.props.comment;
  }

  set comment(comment: string) {
    this.props.comment = comment;
    this.touch();
  }

  get minKm() {
    return this.props.minKm;
  }

  set minKm(minKm: number) {
    this.props.minKm = minKm;
    this.touch();
  }

  get rating() {
    return this.props.rating;
  }

  set rating(rating: number) {
    this.props.rating = rating;
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

  static create(
    props: Optional<DriverProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const driver = new Driver(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return driver;
  }
}
