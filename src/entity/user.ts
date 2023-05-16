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
    length: 30,nullable: true
  })
  email: string; 

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  introductory: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  hobby: string;

  @Column({
    length: 11,nullable: true
  })
  phone: string;
  
  @Column("double",{default:1})
  status: number; 

  @CreateDateColumn()
  createAt: Date;

  @Column("double",{default:0,nullable: true })
  sex: number;
}
 