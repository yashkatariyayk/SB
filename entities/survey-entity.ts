import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { SurveyStatusEntity } from "./surveyStatus-entity";
import { SurveyThemeEntity } from "./surveyTheme-entity";
import { ClientEntity } from "./client-entity";

@Entity("survey")
export class SurveyEntity {
  @PrimaryGeneratedColumn()
  SurveyId: number;

  @Column({
    length: 255
  })
  Name: string;

  @Column({
    nullable: true
  })
  StartDate: Date;

  @Column({
    nullable: true
  })
  EndDate: Date;

  @Column({
    length: 25,
    default: false
  })
  IsDeleted: boolean;

  @Column({
    length: 255,
    nullable: true
  })
  CreatedBy: string;

  @Column({
    nullable: true
  })
  CreatedOn: Date;

  @Column({
    length: 25,
    nullable: true
  })
  ThemeId: number;
  @ManyToOne(() => SurveyThemeEntity)
  @JoinColumn({
    name: "ThemeId",
    referencedColumnName: "SurveyThemeId"
  })
  SurveyTheme: SurveyThemeEntity;

  @Column({
    length: 25,
    nullable: true
  })
  SurveyStatusId: number;
  @ManyToOne(() => SurveyStatusEntity)
  @JoinColumn({
    name: "SurveyStatusId",
    referencedColumnName: "SurveyStatusId"
  })
  SurveyStatus: SurveyStatusEntity;

  @Column({
    length: 25,
    default: 1
  })
  ClientId: number;
  @ManyToOne(
    () => ClientEntity,
    (client) => client.Name
  )
  @JoinColumn({
    name: "ClientId",
    referencedColumnName: "ClientId"
  })
  Client: ClientEntity["Name"];

  @Column({
    length: 25,
    default: false
  })
  IsTemplate: boolean;

  @Column({
    length: 255,
    nullable: true
  })
  LogoName: string;
}
