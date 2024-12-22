import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "./review.entity";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "email", length: 255 })
  email: string;

  @Column("varchar", { name: "pasword", length: 255 })
  pasword: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "phone", length: 15 })
  phone: string;

  @Column("varchar", { name: "address", length: 255 })
  address: string;

  @Column("varchar", { name: "favorite_type", length: 255 })
  favoriteType: string;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
