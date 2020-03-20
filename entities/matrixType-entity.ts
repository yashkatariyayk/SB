import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("matrix_type")
export class MatrixTypeEntity {

    @PrimaryGeneratedColumn()
    MatrixTypeId: number;

    @Column({
        length: 255
    })
    Name: string;
}