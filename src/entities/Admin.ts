import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as Validator from 'class-validator';

@Entity("admin", { schema: "petstore" })
export class Admin {
  @PrimaryGeneratedColumn({ type: "int", name: "admin_id", unsigned: true })
  adminId: number;

  @Column("varchar", { name: "username", length: 64 })
  @Validator.IsNotEmpty()
  username: string;

  @Column("varchar", { name: "password", length: 255 })
  password: string;
}
