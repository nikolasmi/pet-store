import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { CartPet } from "./CartPet";
import { Order } from "./Order";

@Index("fk_cart_user_id", ["userId"], {})
@Entity("cart", { schema: "petstore" })
export class Cart {
  @PrimaryGeneratedColumn({ type: "int", name: "cart_id", unsigned: true })
  cartId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("timestamp", { name: "created_at", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => CartPet, (cartPet) => cartPet.cart)
  cartPets: CartPet[];

  @OneToMany(() => Order, (order) => order.cart)
  orders: Order[];
}
