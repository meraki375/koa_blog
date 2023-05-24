import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn, OneToMany, BaseEntity, ManyToMany } from 'typeorm';
import { Article} from './article'
@Entity()
export class Tab extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number; 
  
  @Column()
  name: string; 

  @Column("double")
  status: number; 

  @CreateDateColumn()
  createAt: Date;

  @ManyToMany(() => Article, (article) => article.tabObj)
  articles: Article[];
}
 