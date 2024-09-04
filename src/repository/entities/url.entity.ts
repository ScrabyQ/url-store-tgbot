import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'urls' })
export class UrlEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'uuid' })
  code: string;

  @Column('text')
  owner: string;
}
