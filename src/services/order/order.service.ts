import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "src/entities/Cart";
import { Order } from "src/entities/Order";
import { ApiResponse } from "src/misc/api.response.class";
import { Or, Repository } from "typeorm";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Cart)
    private readonly cart: Repository<Cart>,

    @InjectRepository(Order)
    private readonly order: Repository<Order>,
  ) {}

  async add(cartId: number): Promise<Order | ApiResponse> {
    const order = await this.order.findOne({
        where: {
            cartId: cartId,
        },
    });

    if(order) {
        return new ApiResponse("error", -7001, "cannot make order");
    }

    const cart = await this.cart.findOne({
        where: {cartId: cartId},
        relations: ["cartPets"],
    });

    if (!cart) {
        return new ApiResponse("error", -7002, 'cart not found')
    }

    if(cart.cartPets.length === 0) {
        return new ApiResponse("error", -7003, 'cart is empty')
    }

    const newOrder: Order = new Order();
    newOrder.cartId = cartId;
    newOrder.status = "u toku";
    newOrder.orderItems = newOrder.orderItems || [];  
    newOrder.totalPrice = newOrder.orderItems.reduce((sum, item) => sum + item.price, 0);

    const savedOrder = await this.order.save(newOrder);

    return await this.order.findOne({
        where: { orderId: savedOrder.orderId },
        relations: [
            "cart",
            "cart.user",
            "cart.cartPets",
            "cart.cartPets.pet"
        ],
    });
  }

  async getById(orderId: number) {
    return await this.order.findOne({
        where: {orderId: orderId},
        relations: [
            "cart",
            "cart.user",
            "cart.cartPets",
            "cart.cartPets.pet"
        ],
    });
  }

  async changeStatus(orderId: number, newStatus: "u toku" | "pristiglo" | "otkazano") {
    const order = await this.getById(orderId);

    if(!order) {
        return new ApiResponse('error', -9001, "order not found");
    }

    order.status = newStatus;
    await this.order.save(order);
    
    return await this.getById(orderId);
  }

}