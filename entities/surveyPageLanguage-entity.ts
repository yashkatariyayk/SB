import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_page_language")
export class SurveyPageLanguageEntity {
  @PrimaryGeneratedColumn()
  SurveyPageLanguageId: number;

  @Column({
    length: 25
  })
  SurveyPageId: number;

  @Column({
    length: 25
  })
  SurveyId: number;

  @Column({
    length: 255
  })
  Name: string;

  @Column("varchar", {
    length: 3000,
    nullable: true
  })
  Description: string;

  @Column({
    length: 25
  })
  LanguageId: number;
}
