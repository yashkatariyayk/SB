import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_question_scale_type")
export class SurveyQuestionScaleTypeEntity {

    @PrimaryGeneratedColumn()
    SurveyQuestionScaleTypeId: number;

    @Column({
        length: 255
    })
    Name: string;

    @Column({
        length: 25
    })
    SortOrder: number;
}