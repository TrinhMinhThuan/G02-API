import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'


@Entity('Users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    googleId: string;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}