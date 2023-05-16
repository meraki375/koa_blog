import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Classes } from './classes';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: number;

  @Column({
    length: 30
  })
  title: string;

  @Column({
    default: '',
    length: 100
  })
  introduce: string;

  @Column({ type: "text" })
  centent: string;

  @Column({ default: 0 })
  readCnt: number;

  @Column()
  classId: number;

  @Column()
  cover_url: string;

  @Column({
    length: 30
  })
  senderName: string;

  @Column("double")
  status: number;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column("double")
  type: number;

  @ManyToOne(() => Classes, (classObj) => classObj.articles)

  @JoinColumn({ name: 'classId' })
  classObj: Classes;

  // async getClassName(): Promise<string> {
  //   await this.classObj?.reload();
  //   return this.classObj?.name;
  // }

}
