import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("email_template_language")
export class EmailTemplateLanguageEntity {
  @PrimaryGeneratedColumn()
  EmailTemplateLanguageId: number;

  @Column({
    length: 255
  })
  EmailTemplateId: number;

  @Column({
    length: 255
  })
  LanguageId: number;

  @Column({
    length: 255
  })
  Subject: string;

  @Column({
    length: 3000
  })
  Body: string;
}
