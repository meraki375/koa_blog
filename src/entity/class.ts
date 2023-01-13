import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn } from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number; 
  
  @Column()
  name: string; 

  @Column("double")
  status: number; 

  @CreateDateColumn()
  createAt: Date;

  
}
 