import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pet } from "./pet.entity";
import { User } from "./user.entity";

@Index("fk_review_user_id", ["userId"], {})
@Index("fk_review_pet_id", ["petId"], {})
@Entity("review")
export class Review {
  @PrimaryGeneratedColumn({ type: "int", name: "review_id", unsigned: true })
  reviewId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("int", { name: "pet_id", unsigned: true })
  petId: number;

  @Column("int", { name: "rating", unsigned: true })
  rating: number;

  @Column("text", { name: "comment" })
  comment: string;

  @ManyToOne(() => Pet, (pet) => pet.reviews, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "pet_id", referencedColumnName: "petId" }])
  pet: Pet;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
