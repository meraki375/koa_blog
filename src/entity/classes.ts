import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn, OneToMany, BaseEntity } from 'typeorm';
import { Article} from './article'
@Entity()
export class Classes extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number; 
  
  @Column()
  name: string; 

  @Column("double")
  status: number; 

  @CreateDateColumn()
  createAt: Date;

  @OneToMany(() => Article, (article) => article.classObj)
  articles: Article[];
}
 