import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("client")
export class ClientEntity {

    @PrimaryGeneratedColumn()
    ClientId: number;

    @Column({
        length: 255
    })
    Name: string;

    @Column({
        length: 255
    })
    Logo: string;

    @Column({
        length: 255
    })
    Email: string;

    @Column({
        length: 255
    })
    IsDeleted: boolean;

    @Column({
        length: 255
    })
    CreatedDate: string;
}