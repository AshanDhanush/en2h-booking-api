import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,ManyToOne,JoinColumn } from 'typeorm';
import {Service} from './service.entity';


export  enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}

@Entity('bookings')  // creates a table called "bookings" in PostgreSQL
export class Booking {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({nullable: false})
    customerName!: string;

    @Column({nullable: false})
    customerEmail!: string;

    @Column({nullable: false})
    customerPhone!: string;

    @ManyToOne(() => Service)
    @JoinColumn({ name: 'service_id' })
    service!: Service;

    @Column()
    serviceId!: string;

    @Column({ type: 'timestamp', nullable: false })
    bookingDate!: Date;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING
    })
    status!: BookingStatus;

    @Column({type: 'text', nullable: true})
    notes!: string;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;

    
}