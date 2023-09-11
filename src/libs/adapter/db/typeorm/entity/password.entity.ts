import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { BaseEntity } from '@libs/adapter/db/typeorm/entity/base.entity';

@Entity('password')
export class PasswordEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false, default: '', comment: '유저 도메인' })
  domain: string;

  @Column({ length: 150, nullable: false, comment: '유저 비밀 번호' })
  password: string;
}
