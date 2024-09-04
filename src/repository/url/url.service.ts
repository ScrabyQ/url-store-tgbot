import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlEntity } from '../entities/url.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
  ) {}

  async getOwnByCode(owner: number, code: string) {
    return await this.urlRepository.findOne({
      where: { owner: String(owner), code },
    });
  }

  async getGlobalByCode(code: string) {
    return await this.urlRepository.findOneBy({ code });
  }

  async getAll(owner: number, limits?: { take: number; skip: number }) {
    const baseClause = { where: { owner: String(owner) } };
    if (limits) {
      Object.assign(baseClause, limits);
    }

    return await this.urlRepository.find(baseClause);
  }

  async create(data: Omit<UrlEntity, 'id'>) {
    return await this.urlRepository.save(data);
  }

  async deleteOne(id: number) {
    return await this.urlRepository.delete({ id });
  }
}
