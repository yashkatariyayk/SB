import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("survey_employee")
export class SurveyEmployeeEntity {

    @PrimaryGeneratedColumn()
    SurveyEmployeeId: number;

    @Column({
        length: 25
    })
    SurveyId: number;

    @Column({
        length: 25
    })
    EmployeeId: number;

    @Column({
        length: 255
    })
    FirstName: string;

    @Column({
        length: 255
    })
    LastName: string;

    @Column({
        length: 255
    })
    Email: string;

    @Column({
        length: 255
    })
    Role: string;

    @Column({
        length: 255
    })
    Department: string;

    @Column({
        length: 255
    })
    CompanyId: string;
}