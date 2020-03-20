import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_response_link")
export class SurveyResponseLinkEntity {
  @PrimaryGeneratedColumn()
  SurveyResponseLinkId: number;

  @Column({
    length: 255
  })
  SurveyResponseId: number;

  @Column({
    length: 255,
    nullable: true
  })
  SurveyQuestionOptionId: number;

  @Column({
    length: 255,
    nullable: true
  })
  MatrixTableRecordId: number;

  @Column({
    length: 255
  })
  MatrixTypeId: number;

  @Column({
    length: 255,
    nullable: true
  })
  Value: string;

  @Column({
    length: 255,
    nullable: true
  })
  Comment: string;

  @Column({
    length: 25,
    default: false
  })
  IsDeleted: boolean;
}
