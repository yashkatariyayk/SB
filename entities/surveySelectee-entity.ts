import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_selectee")
export class SurveySelecteeEntity {

    @PrimaryGeneratedColumn()
    SurveySelecteeId: number;

    @Column({
        length: 25
    })
    SurveyId: number;

    @Column({
        length: 25,
        nullable: true
    })
    EmployeeId: number;

    @Column({
        length: 255
    })
    FirstName: string;

    @Column({
        length: 255,
        nullable: true
    })
    LastName: string;

    @Column({
        length: 255,
        nullable: true
    })
    Email: string;

    @Column({
        length: 255,
        nullable: true
    })
    Role: string;

    @Column({
        length: 255,
        nullable: true
    })
    Department: string;

    @Column({
        length: 255,
        nullable: true
    })
    CompanyId: string;

    @Column({
        length: 255,
        default: false
    })
    Miscellaneous: string;

    @Column({
        length: 255,
        default: false
    })
    IsDeleted: boolean;
}