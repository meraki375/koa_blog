import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn } from 'typeorm';

@Entity()
export class Privacy {
  @PrimaryGeneratedColumn()
  id: number; 
  
  @Column({ type: "text"})
  content: string; 

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
}
 