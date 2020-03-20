import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_page_type")
export class SurveyPageTypeEntity {

    @PrimaryGeneratedColumn()
    SurveyPageTypeId: number;

    @Column({
        length: 255,
        nullable: true
    })
    Name: string;

    @Column({
        length: 255,
        nullable: true
    })
    Title: string;

    @Column("varchar", {
        length: 3000,
        nullable: true
    })
    Description: string;

}