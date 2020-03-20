import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_theme")
export class SurveyThemeEntity {

    @PrimaryGeneratedColumn()
    SurveyThemeId: number;

    @Column({
        length: 255
    })
    Name: string;
}