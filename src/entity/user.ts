import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    length: 30
  })
  email: string; 

  @Column()
  avatar: string;

  @Column({
    length: 11
  })
  phone: string;
  
  @Column("double",{default:1})
  status: number; 

  @CreateDateColumn()
  createAt: Date;

  @Column("double",{default:0})
  sex: number;
  // @Column()
  // registrationDate: string;

  // @Column()
  // accountId: string;

  // @Column()
  // role: string;
}
 