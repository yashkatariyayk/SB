import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_response_link")
export class SurveyResponseLinkEntity {
  @PrimaryGeneratedColumn()
  SurveyResponseLinkId: number;

  @Column({
    length: 255
  })
  SurveyResponseId: string;

  @Column({
    length: 255
  })
  SurveyQuestionOptionId: string;

  @Column({
    length: 255
  })
  SurveySelecteeId: number;

  @Column({
    length: 255
  })
  Value: string;

  @Column({
    length: 255
  })
  Comment: string;
}
