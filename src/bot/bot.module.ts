import { Module } from '@nestjs/common';
import { UuidModule } from 'nestjs-uuid';
import { BotUpdate } from './bot.update';
import { AddScene } from './scenes/add.scene';
import { ListScene } from './scenes/list.scene';
import { GetScene } from './scenes/get.scene';
import { DeleteScene } from './scenes/delete.scene';
import { StartScene } from './scenes/start.scene';
import { UrlModule } from 'src/repository/url/url.module';

@Module({
  imports: [UuidModule, UrlModule],
  providers: [
    BotUpdate,
    AddScene,
    ListScene,
    GetScene,
    DeleteScene,
    StartScene,
  ],
})
export class BotModule {}
