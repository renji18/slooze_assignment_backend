import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { role: true, country: true },
      });

      if (!user) throw new NotFoundException('User not found');

      if (!user.role || !user.country)
        throw new InternalServerErrorException(
          'User is missing role or country information',
        );

      return user;
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof InternalServerErrorException
      ) {
        throw err;
      }

      console.error('Unexpected error in UserService.getMe:', err);
      throw new InternalServerErrorException('Could not retrieve user');
    }
  }
}
