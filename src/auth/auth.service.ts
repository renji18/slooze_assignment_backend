import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(body: {
    email: string;
    password: string;
  }): Promise<{ access_token: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: body.email },
        include: { role: true, country: true },
      });

      if (!user) throw new UnauthorizedException('Invalid email or password');

      const passwordMatch = await bcrypt.compare(body.password, user.password);
      if (!passwordMatch)
        throw new UnauthorizedException('Invalid email or password');

      if (!user.role || !user.country)
        throw new InternalServerErrorException(
          'User is missing role or country association',
        );

      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role.name,
        countryId: user.country.id,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (err) {
      if (
        err instanceof UnauthorizedException ||
        err instanceof InternalServerErrorException
      ) {
        throw err;
      }

      console.error('Unexpected error in AuthService.login:', err);
      throw new InternalServerErrorException('Login failed');
    }
  }
}
