import { Injectable } from "@nestjs/common";
import { DriverRepository } from "../../../../domain/travel/application/repositories/driver-repository";
import { Driver } from "src/domain/travel/enterprise/entities/driver";
import { PrismaService } from "../prisma.service";
import { PrismaDriverMapper } from "../mappers/prisma-driver-mapper";

@Injectable()
export class PrismaDriverRepository implements DriverRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findById(id: number): Promise<Driver | null> {
        const data = await this.prismaService.driver.findUnique({
            where: {
                id,
            }
        })

        if (!data) return null

        return PrismaDriverMapper.toDomain(data)
    }
    async findAll(): Promise<Driver[]> {
       const data = await this.prismaService.driver.findMany()

       return data.map(PrismaDriverMapper.toDomain);
    }

}