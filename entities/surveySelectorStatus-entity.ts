import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_selector_status")
export class SurveySelectorStatusEntity {

    @PrimaryGeneratedColumn()
    SurveySelectorStatusId: number;

    @Column({
        length: 255
    })
    Name: string;
}