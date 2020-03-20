import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_question_option")
export class SurveyQuestionOptionEntity {

    @PrimaryGeneratedColumn()
    SurveyQuestionOptionId: number;

    @Column({
        length: 25
    })
    SurveyId: number;

    @Column({
        length: 25,
        nullable: true
    })
    SurveyQuestionId: number;

    @Column({
        length: 255,
        nullable: true
    })
    Name: string;

    @Column({
        length: 25
    })
    ControlTypeId: number;

    @Column({
        length: 25,
        nullable: true
    })
    SortOrder: number;

    @Column({
        length: 25,
        default: false
    })
    IsComment: boolean;

    @Column({
        length: 25,
        default: false
    })
    IsCommentRequire: boolean;

    @Column({
        length: 25,
        default: false
    })
    IsDeleted: boolean;
}