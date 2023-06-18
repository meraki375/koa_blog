import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn} from 'typeorm';
import { wl_Comment} from './wl_Comment'

@Entity({ name: 'wl_Counter' })
export class wl_Counter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  time: number;

  @Column({ type: 'int', nullable: true })
  reaction0: number;

  @Column({ type: 'int', nullable: true })
  reaction1: number;

  @Column({ type: 'int', nullable: true })
  reaction2: number;

  @Column({ type: 'int', nullable: true })
  reaction3: number;

  @Column({ type: 'int', nullable: true })
  reaction4: number;

  @Column({ type: 'int', nullable: true })
  reaction5: number;

  @Column({ type: 'int', nullable: true })
  reaction6: number;

  @Column({ type: 'int', nullable: true })
  reaction7: number;

  @Column({ type: 'int', nullable: true })
  reaction8: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  url: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date; 
 
}
