import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_selector")
export class SurveySelectorEntity {

    @PrimaryGeneratedColumn()
    SurveySelectorId: number;

    @Column({
        length: 25
    })
    SurveyId: number;

    @Column({
        length: 255
    })
    FirstName: string;

    @Column({
        length: 255
    })
    LastName: string;

    @Column({
        length: 255
    })
    Email: string;

    @Column({
        length: 255,
        nullable: true
    })
    Hash: string;

    @Column({
        length: 255,
        nullable: true
    })
    StartDate: string;

    @Column({
        length: 255,
        nullable: true
    })
    EndDate: string;

    @Column({
        length: 255,
        nullable: true
    })
    SurveySelectorStatusId: number;

    @Column({
        length: 255,
        nullable: true
    })
    CompletedPageId: number;

    @Column({
        length: 255,
        nullable: true
    })
    LastAccessedPageId: number;

    @Column({
        length: 255,
        default: false
    })
    IsDeleted: boolean;
    @Column({
        length: 255,
        nullable: true
    })
    Language: string;
}