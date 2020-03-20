import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_response")
export class SurveyResponseEntity {
  @PrimaryGeneratedColumn()
  SurveyResponseId: number;

  @Column({
    length: 25
  })
  SurveyId: number;

  @Column({
    length: 25
  })
  SurveySelectorId: number;

  @Column({
    length: 25
  })
  SurveyQuestionId: number;

  @Column({
    length: 25,
    default: false
  })
  IsDeleted: boolean;
}
