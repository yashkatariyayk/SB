import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("email_configuration")
export class EmailConfigEntity {
  @PrimaryGeneratedColumn()
  EmailConfigId: number;

  @Column({
    length: 255
  })
  Host: string;

  @Column({
    length: 255
  })
  Port: number;

  @Column({
    length: 255,
    nullable: true
  })
  Username: string;

  @Column({
    length: 255,
    nullable: true
  })
  Password: string;

  @Column({
    length: 255
  })
  FromEmail: string;

  @Column({
    length: 255
  })
  IsSecure: boolean;

  @Column({
    length: 255
  })
  IsActive: boolean;
}
