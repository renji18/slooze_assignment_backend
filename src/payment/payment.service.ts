import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async addOrUpdate(method: string) {
    try {
      return this.prisma.paymentMethod.upsert({
        where: { method },
        update: {},
        create: { method },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to add or update payment method',
      );
    }
  }

  async delete(methodId: string) {
    try {
      const existing = await this.prisma.paymentMethod.findUnique({
        where: { id: methodId },
      });

      if (!existing) throw new NotFoundException('Payment method not found');

      return this.prisma.paymentMethod.delete({
        where: { id: methodId },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete payment method');
    }
  }

  async getAll() {
    try {
      return this.prisma.paymentMethod.findMany({});
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to fetch payment methods');
    }
  }
}
