import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { RestaurantModule } from './restaurant/restaurant.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, RestaurantModule, OrderModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
