import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/entities/Order";
import { OrderItems } from "src/entities/OrderItems";
import { Pet } from "src/entities/Pet";
import { Repository } from "typeorm";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItems)
    private readonly orderItemRepository: Repository<OrderItems>,

    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>
  ) {}

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  async findAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ["user", "orderItems", "orderItems.pet"], 
    });
  }

  async findOrderById(orderId: number): Promise<Order> {
    return await this.orderRepository.findOne({
      where: { orderId },
      relations: ["user", "orderItems", "orderItems.pet"],
    });
  }

  async updateOrder(orderId: number, orderData: Partial<Order>): Promise<Order> {
    await this.orderRepository.update(orderId, orderData);
    return this.findOrderById(orderId); 
  }

  async deleteOrder(orderId: number): Promise<void> {
    const order = await this.findOrderById(orderId);
    if (order) {
      await this.orderRepository.remove(order); 
    } else {
      throw new Error("Order not found"); 
    }
  }

  async addOrderItem(orderId: number, petId: number, price: number): Promise<OrderItems> {
    const order = await this.findOrderById(orderId); 
    const pet = await this.petRepository.findOne({ where: { petId } });

    if (!order || !pet) {
      throw new Error("Order or Pet not found");
    }

    const orderItem = this.orderItemRepository.create({
      orderId,
      petId,
      price,
      order, 
      pet, 
    });

    return await this.orderItemRepository.save(orderItem); 
  }

  async deleteOrderItem(orderItemsId: number): Promise<void> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { orderItemsId }, 
      relations: ["order", "pet"], 
    });
  
    if (!orderItem) {
      throw new Error("OrderItem not found");
    }
  
    await this.orderItemRepository.remove(orderItem); 
  }
}
