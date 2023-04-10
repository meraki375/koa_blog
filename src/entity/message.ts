import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number; 
  
  @Column({ type: "text"})
  centent: string; 

  @CreateDateColumn()
  createAt: Date;

  
}
 