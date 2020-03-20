import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("import_selector")
export class ImportSelectorEntity {

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