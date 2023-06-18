import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { wl_Counter } from './wl_Counter';

@Entity({ name: 'wl_Comment' })
export class wl_Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn({ name: 'insertedAt', nullable: true })
  insertedAt: Date;

  @Column({ type: 'varchar', length: 100, default: '' })
  ip: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nick: string;

  @Column({ nullable: true })
  pid: number;

  @Column({ nullable: true })
  rid: number;

  @Column({ type: 'tinyint', nullable: true })
  sticky: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  status: string;

  @Column({ nullable: true })
  like: number;

  @Column({ type: 'text', nullable: true })
  ua: string;

  @Column({ type: 'varchar', length: 255, default: ''})
  url: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;
}
