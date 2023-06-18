import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wl_Users')
export class wl_Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'display_name' })
  displayName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  label: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  google: string;

  @Column({ nullable: true })
  weibo: string;

  @Column({ nullable: true })
  qq: string;

  @Column({ name: '2fa' })
  twoFactorAuth: string;

  @Column({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'updatedAt' })
  updatedAt: Date;
}
