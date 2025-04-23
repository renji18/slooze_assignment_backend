import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Delete,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

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
    @Req() req: Request,
  ) {
    return this.orderService.createOrder(body.items, req.user);
  }

  @Post('checkout/:id')
  @Roles('ADMIN', 'MANAGER')
  placeOrder(
    @Param('id') id: string,
    @Body()
    body: {
      paymentMethodId: string;
    },
    @Req() req: Request,
  ) {
    return this.orderService.placeOrder(id, body.paymentMethodId, req.user);
  }

  @Delete('cancel/:id')
  @Roles('ADMIN', 'MANAGER')
  cancel(@Param('id') id: string, @Req() req: Request) {
    return this.orderService.cancelOrder(id, req.user);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  getOrders(@Req() req: Request) {
    return this.orderService.getOrders(req.user);
  }
}
