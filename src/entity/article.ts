import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TextDecoder } from 'util';

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

  @Column({ type: "text"})
  centent: string;

  @Column({default:0})
  readCnt: number;

  @Column()
  class: number;

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
  // @Column()
  // registrationDate: string;

  // @Column()
  // accountId: string;

  // @Column()
  // role: string;
}
 