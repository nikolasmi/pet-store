import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItems } from "./orderItems.entity";

@Entity("order")
export class Order {
  @PrimaryGeneratedColumn({ type: "int", name: "order_id", unsigned: true })
  orderId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("enum", {
    name: "status",
    enum: ["u toku", "pristiglo", "otkazano"],
    default: () => "'u toku'",
  })
  status: "u toku" | "pristiglo" | "otkazano";

  @Column("int", { name: "total_price", unsigned: true })
  totalPrice: number;

  @OneToMany(() => OrderItems, (orderItems) => orderItems.order)
  orderItems: OrderItems[];
}
