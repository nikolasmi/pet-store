import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { Pet } from "./Pet";

@Index("fk_cart_pet_cart_id", ["cartId"], {})
@Index("fk_cart_pet_pet_id", ["petId"], {})
@Index("uq_cart_pet_cart_id_pet_id", ["cartId", "petId"], { unique: true })
@Entity("cart_pet", { schema: "petstore" })
export class CartPet {
  @PrimaryGeneratedColumn({ type: "int", name: "cart_pet_id", unsigned: true })
  cartPetId: number;

  @Column("int", { name: "cart_id", unsigned: true, default: () => "'0'" })
  cartId: number;

  @Column("int", { name: "pet_id", unsigned: true, default: () => "'0'" })
  petId: number;

  @Column("int", { name: "quantity", unsigned: true, default: () => "'0'" })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartPets, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "cart_id", referencedColumnName: "cartId" }])
  cart: Cart;

  @ManyToOne(() => Pet, (pet) => pet.cartPets, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "pet_id", referencedColumnName: "petId" }])
  pet: Pet;
}
