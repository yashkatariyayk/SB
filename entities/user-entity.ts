import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  UserId: number;

  @Column({
    length: 25
  })
  FirstName: string;

  @Column({
    length: 25
  })
  LastName: string;

  @Column({
    length: 1000
  })
  Email: string;

  @Column({
    length: 255
  })
  Password: string;

  @Column({
    length: 255
  })
  ClientId: number;
}
