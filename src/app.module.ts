import { Module } from '@nestjs/common';
import { UuidModule } from 'nestjs-uuid';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from 'src/bot/bot.module';
import { BOT_NAME } from 'src/app.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from 'src/repository/entities/url.entity';
import { sessionMiddleware } from 'src/middlewares/session.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.TELEGRAM_TOKEN,
        middlewares: [sessionMiddleware],
        include: [BotModule],
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      entities: [UrlEntity],
    }),
    BotModule,
    UuidModule,
  ],
})
export class AppModule {}
