import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("config")
export class ConfigEntity {

    @PrimaryGeneratedColumn()
    ConfigId: number;

    @Column({
        length: 255
    })
    Name: string;

    @Column({
        length: 255
    })
    Count: string;
}