import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn } from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number; 
  
  @Column()
  title: string; 

  @Column()
  cover_url: string; 

  @Column({ type: 'varchar', length: 255, default: '' })
  url: string;

  @Column()
  content: string; 

  @Column("double")
  status: number; 

  @CreateDateColumn()
  createAt: Date;

  
}
 