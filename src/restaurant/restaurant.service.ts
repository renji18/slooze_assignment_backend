import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async getRestaurantsByCountry(countryId: string) {
    try {
      if (!countryId)
        throw new BadRequestException('Invalid countryId provided');

      const restaurants = await this.prisma.restaurant.findMany({
        where: { countryId },
        include: { menuItems: true },
      });

      if (restaurants.length === 0)
        throw new NotFoundException('No restaurants found for this country');

      return restaurants;
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException ||
        err instanceof InternalServerErrorException
      ) {
        throw err;
      }

      console.error('Unexpected error in RestaurantService:', err);
      throw new InternalServerErrorException('Failed to fetch restaurants');
    }
  }
}
