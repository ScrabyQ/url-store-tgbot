import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
}
bootstrap();
