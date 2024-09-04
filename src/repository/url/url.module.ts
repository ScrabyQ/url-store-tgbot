import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlEntity } from '../entities/url.entity';
import { UrlService } from './url.service';

@Module({
  imports: [TypeOrmModule.forFeature([UrlEntity])],
  exports: [TypeOrmModule, UrlService],
  providers: [UrlService],
})
export class UrlModule {}
