import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("email_template")
export class EmailTemplateEntity {

    @PrimaryGeneratedColumn()
    EmailTemplateId: number;

    @Column({
        length: 255
    })
    Title: string;

    @Column({
        length: 255
    })
    Subject: string;

    @Column({
        length: 3000
    })
    Body: string;
}