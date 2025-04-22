import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  createOrder(
    @Body()
    body: {
      items: Array<{ menuItemId: string; quantity: number }>;
    },
  ) {
    return this.orderService.createOrder(body.items);
  }

  @Post('checkout/:id')
  @Roles('ADMIN', 'MANAGER')
  placeOrder(
    @Param('id') id: string,
    @Body()
    body: {
      paymentMethodId: string;
    },
  ) {
    return this.orderService.placeOrder(id, body.paymentMethodId);
  }

  @Delete('cancel/:id')
  @Roles('ADMIN', 'MANAGER')
  cancel(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  getOrders() {
    return this.orderService.getOrders();
  }
}
