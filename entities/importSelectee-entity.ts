import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("import_selectee")
export class ImportSelecteeEntity {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({
        length: 25
    })
    SurveyId: number;

    @Column({
        length: 255
    })
    LastImportedDate: string;
}