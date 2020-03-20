import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("static_content_language")
export class StaticContentLanguageEntity {
  @PrimaryGeneratedColumn()
  StaticContentLanguageId: number;

  @Column({
    length: 255
  })
  StaticContentId: number;

  @Column({
    length: 255
  })
  SurveyId: number;

  @Column({
    length: 255
  })
  LanguageId: number;

  @Column({
    length: 255
  })
  Value: string;
}
