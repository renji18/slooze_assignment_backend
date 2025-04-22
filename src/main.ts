import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // frontend origin
    credentials: true,
  });
  await app.listen(8000);
}

bootstrap().then(() => console.log('server is running on port: ' + 8000));
