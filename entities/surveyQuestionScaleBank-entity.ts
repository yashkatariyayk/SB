import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_question_scale_bank")
export class SurveyQuestionScaleBankEntity {

    @PrimaryGeneratedColumn()
    SurveyQuestionScaleBankId: number;

    @Column({
        length: 25
    })
    UserId: number;

    @Column({
        length: 25
    })
    SurveyQuestionControlTypeId: number;

    @Column({
        length: 255
    })
    Name: string;
}