import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn } from 'typeorm';

@Entity()
export class Wallpaper {
  @PrimaryGeneratedColumn()
  id: number; 
  
  @Column()
  image_url: string; 

  @Column("double")
  type: number;

  @CreateDateColumn()
  createAt: Date;

  
}