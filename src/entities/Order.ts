import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { User } from "./User";
import { OrderItems } from "./OrderItems";

@Index("fk_order_cart_id", ["cartId"], {})
@Index("fk_order_user_id", ["userId"], {})
@Entity("order", { schema: "petstore" })
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

  @Column("timestamp", { name: "created_at", default: () => "'now()'" })
  createdAt: Date;

  @Column("int", { name: "cart_id", unsigned: true })
  cartId: number;

  @ManyToOne(() => Cart, (cart) => cart.orders, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "cart_id", referencedColumnName: "cartId" }])
  cart: Cart;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => OrderItems, (orderItems) => orderItems.order)
  orderItems: OrderItems[];
}
