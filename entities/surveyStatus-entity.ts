import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_status")
export class SurveyStatusEntity {

    @PrimaryGeneratedColumn()
    SurveyStatusId: number;

    @Column({
        length: 255
    })
    Name: string;
}