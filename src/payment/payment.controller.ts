import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles('ADMIN')
  add(@Body() body: { method: string }) {
    return this.paymentService.addOrUpdate(body.method);
  }

  @Delete('/:methodId')
  @Roles('ADMIN')
  delete(@Param('methodId') methodId: string) {
    return this.paymentService.delete(methodId);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER')
  get() {
    return this.paymentService.getAll();
  }
}
