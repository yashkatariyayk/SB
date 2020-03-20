import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, JoinColumn, ManyToMany } from "typeorm";
import { SurveyQuestionOptionEntity } from "./surveyQuestionOption-entity";

@Entity("survey_question")
export class SurveyQuestionEntity {

    @PrimaryGeneratedColumn()
    SurveyQuestionId: number;

    @Column({
        length: 25
    })
    SurveyId: number;

    @Column({
        length: 25
    })
    SurveyPageId: number;

    @Column({
        length: 3000
    })
    Name: string;

    @Column("varchar", {
        length: 3000,
        nullable: true
    })
    Description: string;

    @Column({
        length: 25,
        nullable: true
    })
    SortOrder: number;

    @Column({
        length: 25
    })
    ScaleTypeId: number;

    @Column({
        length: 25,
        nullable: true
    })
    MatrixTypeId: number

    @Column({
        length: 25,
        default: 0
    })
    ParentQuestionId: number

    @Column({
        length: 25,
        default: false
    })
    IsRequire: boolean;

    @Column({
        length: 25,
        default: false
    })
    IsMaxChoice: boolean;

    @Column({
        length: 25,
        nullable: true
    })
    MaxChoice: number;

    @Column({
        length: 25,
        default: false
    })
    IsOther: boolean;

    @Column({
        length: 25,
        default: false
    })
    IsDeleted: boolean;
}