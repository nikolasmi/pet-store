import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order";
import { Pet } from "./Pet";

@Index("fk_order_items_order_id", ["orderId"], {})
@Index("fk_order_items_pet_id", ["petId"], {})
@Entity("order_items", { schema: "petstore" })
export class OrderItems {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "order_items_id",
    unsigned: true,
  })
  orderItemsId: number;

  @Column("int", { name: "order_id", unsigned: true })
  orderId: number;

  @Column("int", { name: "pet_id", unsigned: true })
  petId: number;

  @Column("int", { name: "price", unsigned: true })
  price: number;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "order_id", referencedColumnName: "orderId" }])
  order: Order;

  @ManyToOne(() => Pet, (pet) => pet.orderItems, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "pet_id", referencedColumnName: "petId" }])
  pet: Pet;
}
