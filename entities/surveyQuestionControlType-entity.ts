import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_question_control_type")
export class SurveyQuestionControlTypeEntity {

    @PrimaryGeneratedColumn()
    SurveyQuestionControlTypeId: number;

    @Column({
        length: 255
    })
    Name: string;

    @Column({
        length: 25
    })
    SortOrder: number;
}