import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_question_option_value")
export class SurveyQuestionOptionValueEntity {

    @PrimaryGeneratedColumn()
    SurveyQuestionOptionValueId: number;

    @Column({
        length: 25
    })
    SurveyId: number;

    @Column({
        length: 25
    })
    SurveyQuestionOptionId: number;

    @Column({
        length: 255
    })
    Name: string;

    @Column({
        length: 255
    })
    Value: string;

    @Column({
        length: 25
    })
    InfoCode: number;
}