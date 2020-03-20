import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("email_log")
export class EmailLogEntity {

    @PrimaryGeneratedColumn()
    EmailLogId: number;

    @Column({
        length: 25
    })
    SurveySelectorId: number;

    @Column({
        length: 255
    })
    Email: string;

    @Column({
        length: 255
    })
    Subject: string;

    @Column({
        length: 3000
    })
    Body: string;

    @Column({
        length: 255,
        nullable: true
    })
    Error: string;

    @Column({
        length: 255,
        nullable: true
    })
    Status: string;

    @Column({
        length: 255,
        nullable: true
    })
    TriedCount: number;

    @Column({
        length: 255,
        default: false
    })
    IsDeleted: boolean;
}