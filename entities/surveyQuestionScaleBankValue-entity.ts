import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_question_scale_bank_value")
export class SurveyQuestionScaleBankValueEntity {

    @PrimaryGeneratedColumn()
    SurveyQuestionScaleBankValueId: number;

    @Column({
        length: 25
    })
    SurveyQuestionScaleBankId: number;

    @Column({
        length: 255
    })
    Name: string;

    @Column({
        length: 255
    })
    Value: string;
}