import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RestaurantService } from './restaurant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  getRestaurants(@Req() req: any) {
    return this.restaurantService.getRestaurantsByCountry(req.user.countryId);
  }
}
