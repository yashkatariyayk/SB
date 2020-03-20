import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { SurveyEntity } from "./survey-entity";

@Entity("survey_page")
export class SurveyPageEntity {

    @PrimaryGeneratedColumn()
    SurveyPageId: number;

    @Column({
        length: 25
    })
    SurveyId: number;

    @ManyToOne(() => SurveyEntity)
    @JoinColumn({
        name: "SurveyId",
        referencedColumnName: 'SurveyId'
    })
    survey: SurveyEntity;

    @Column({
        length: 255
    })
    Name: string;

    @Column("varchar", {
        length: 3000,
    })
    Description: string;

    @Column({
        length: 25,
        nullable: true
    })
    PageOrder: number;

    @Column({
        length: 25,
        nullable: true
    })
    SurveyPageTypeId: number;

    @Column({
        length: 25,
        default: false
    })
    IsDeleted: boolean;
}