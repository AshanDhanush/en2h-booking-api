import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import { User } from './user.entity';

@Entity('services')  // creates a table called "services" in PostgreSQL
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;
     
    @Column({ type: 'int' })
    duration!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({default: true})
    isActive!: boolean;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    createdBy!: User;

    @Column()
    createdById!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}       