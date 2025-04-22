import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(items: { menuItemId: string; quantity: number }[]) {
    try {
      if (!items || items.length === 0)
        throw new BadRequestException('Order must include at least one item');

      const menuItemIds = items.map((i) => i.menuItemId);
      const menuItems = await this.prisma.menuItem.findMany({
        where: { id: { in: menuItemIds } },
      });

      if (menuItems.length !== items.length)
        throw new NotFoundException('Some menu items were not found');

      let totalAmount = 0;
      const orderItems = items.map((item) => {
        const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
        const itemTotal = menuItem.price * item.quantity;
        totalAmount += itemTotal;

        return {
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          itemTotal,
        };
      });

      return await this.prisma.order.create({
        data: {
          status: 'pending',
          totalAmount,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException ||
        err instanceof InternalServerErrorException
      ) {
        throw err;
      }

      console.error('Unexpected error in OrderService.createOrder:', err);
      throw new InternalServerErrorException('Could not create order');
    }
  }

  async placeOrder(orderId: string, paymentMethodId: string) {
    try {
      const existing = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!existing) throw new NotFoundException('Order not found');

      const paymentMethod = await this.prisma.paymentMethod.findUnique({
        where: { id: paymentMethodId },
      });

      if (!paymentMethod)
        throw new NotFoundException('Payment method not found');

      return this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'paid', paymentMethodId },
      });
    } catch (err) {
      if (err instanceof NotFoundException) throw err;

      console.error('Unexpected error in OrderService.placeOrder:', err);
      throw new InternalServerErrorException('Failed to place order');
    }
  }

  async cancelOrder(orderId: string) {
    try {
      const existing = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!existing) throw new NotFoundException('Order not found');

      if (existing.status === 'paid')
        throw new BadRequestException('Order is paid');

      return this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
      });
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof BadRequestException
      )
        throw err;

      console.error('Unexpected error in OrderService.cancelOrder:', err);
      throw new InternalServerErrorException('Failed to cancel order');
    }
  }

  async getOrders() {
    try {
      return this.prisma.order.findMany({
        include: {
          items: { include: { menuItem: true } },
          paymentMethod: true,
        },
      });
    } catch (err) {
      console.error('Unexpected error in OrderService.getOrders:', err);
      throw new InternalServerErrorException('Failed to fetch orders');
    }
  }
}
