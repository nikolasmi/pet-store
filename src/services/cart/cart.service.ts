import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "src/entities/Cart";
import { CartPet } from "src/entities/CartPet";
import { Order } from "src/entities/Order";
import { Pet } from "src/entities/Pet";
import { Repository } from "typeorm";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cart: Repository<Cart>,

    @InjectRepository(CartPet)
    private readonly cartPet: Repository<CartPet>,
  ) {}

  async getLastActiveCartByUserId(userId: number): Promise<Cart | null> {
    const carts = await this.cart.find({
      where: {
        userId: userId
      },
      order: {
        createdAt: "DESC",
      },
      take: 1,
      relations: [ "orders" ],
    });

    if(!carts || carts.length === 0) {
      return null;
    } 

    const cart = carts[0];

    if (cart.orders && cart.orders.length > 0) {
      return null;
    }

    return cart;
  }

  async createNewCartForUser(userId: number): Promise<Cart> {
    const newCart: Cart = new Cart();
    newCart.userId = userId;
    return await this.cart.save(newCart);
  }

  async addPetToCart(cartId: number, petId: number, quantity: number): Promise<Cart>{
    let record: CartPet = await this.cartPet.findOne({
      where: {
        cartId: cartId,
        petId: petId,
      },
    });

    if(!record) {
      record = new CartPet();
      record.cartId = cartId;
      record.petId = petId;
      record.quantity = quantity;
    } else {
      record.quantity += quantity;
    }

    await this.cartPet.save(record);

    return this.getById(cartId);
  }

  async getById(cartId: number): Promise<Cart> {
    try {
        return await this.cart.findOne({
            where: { cartId: cartId },
            relations: [
                "user",
                "cartPets",
                "cartPets.pet",
            ],
        });
      } catch (error) {
        console.error("Error fetching cart by ID:", error);
        throw new HttpException('Failed to fetch cart details', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  async changeQuantity(cartId: number, petId: number, newQuantity: number): Promise<Cart> {
    let record: CartPet = await this.cartPet.findOne({
      where: {
        cartId: cartId,
        petId: petId,
      },
    });

    if(record) {
      record.quantity = newQuantity;
      
      if(record.quantity === 0){
        await this.cartPet.delete(record.cartPetId)
      } else {
        await this.cartPet.save(record);
      }
    }

    return await this.getById(cartId);
  }

  async removePetFromCart(cartId: number, cartPetId: number): Promise<void> {
    await this.cartPet.delete({ cartId, cartPetId });
  }

}
