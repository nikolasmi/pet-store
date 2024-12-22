import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItems } from "./orderItems.entity";
import { Review } from "./review.entity";

@Entity("pet")
export class Pet {
  @PrimaryGeneratedColumn({ type: "int", name: "pet_id", unsigned: true })
  petId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("varchar", { name: "type", length: 50 })
  type: string;

  @Column("int", { name: "age", unsigned: true })
  age: number;

  @Column("varchar", { name: "size", length: 50 })
  size: string;

  @Column("varchar", { name: "origin", length: 100 })
  origin: string;

  @Column("int", { name: "price", unsigned: true })
  price: number;

  @Column("enum", {
    name: "availabe",
    enum: ["dostupno", "nedostupno"],
    default: () => "'dostupno'",
  })
  availabe: "dostupno" | "nedostupno";

  @Column("varchar", { name: "image_path", length: 255 })
  imagePath: string;

  @OneToMany(() => OrderItems, (orderItems) => orderItems.pet)
  orderItems: OrderItems[];

  @OneToMany(() => Review, (review) => review.pet)
  reviews: Review[];
}
