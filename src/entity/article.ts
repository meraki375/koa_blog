import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToOne, RelationId } from 'typeorm';
import { Classes } from './classes';
import { Tab } from './tab';
import { wl_Counter } from './wl_Counter';


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

  @Column({
    default: '',
    length: 100
  })
  introduce: string;

  @Column({ type: "text" })
  content: string;

  @Column()
  classId: number;

  @Column()
  cover_url: string;

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

  @Column({ nullable: true})
  tabs: string;

  @ManyToOne(() => Classes, (classObj) => classObj.articles)

  @JoinColumn({ name: 'classId' })
  classObj: Classes;

  @ManyToMany(() => Tab, tabObj => tabObj.articles)
 
  @JoinTable({
    name: 'article_tab_obj_tab',
    joinColumn: { name: 'articleId' },
    inverseJoinColumn: { name: 'tabId' }
  })
  tabObj: Tab[];

  @OneToOne(() => wl_Counter)
  @JoinColumn()
  counter: wl_Counter;
}
