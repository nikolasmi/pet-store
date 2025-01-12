import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { addPetToCartDto } from "src/dtos/cart/add.pet.to.cart.dto";
import { editPetInCartDto } from "src/dtos/cart/edit.pet.in.cart.dto";
import { Cart } from "src/entities/Cart";
import { Order } from "src/entities/Order";
import { allowToRoles } from "src/misc/allow.to.roles.descriptor";
import { ApiResponse } from "src/misc/api.response.class";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { CartService } from "src/services/cart/cart.service";
import { OrderService } from "src/services/order/order.service";

@Controller('api/cart')
export class UserCartController {
    constructor(
        private cartService: CartService,
        private orderService: OrderService,
    ) { }

    private async getActiveCartForUserId(userId: number): Promise<Cart> {
        let cart = await this.cartService.getLastActiveCartByUserId(userId);
        
        if (!cart) {
          cart = await this.cartService.createNewCartForUser(userId);
        }
      
        return await this.cartService.getById(cart.cartId);
      }

    
    @Get()
    @UseGuards(RoleCheckerGuard)
    @allowToRoles("user", "admin")
    async getCurrentCart(@Req() req: Request): Promise<Cart> {
        return await this.getActiveCartForUserId(req.token.id);
    }

    @Post('addToCart')
    @UseGuards(RoleCheckerGuard)
    @allowToRoles("user", "admin")
    async addToCart(@Body() data: addPetToCartDto, @Req() req: Request): Promise<Cart> {
        const cart = await this.getActiveCartForUserId(req.token.id);
        return await this.cartService.addPetToCart(cart.cartId, data.petId, data.quantity);
    }

    @Patch()
    @UseGuards(RoleCheckerGuard)
    @allowToRoles("user", "admin")
    async changeQuantity(@Body() data: editPetInCartDto, @Req() req: Request): Promise<Cart> {
        const cart = await this.getActiveCartForUserId(req.token.id);
        return await this.cartService.changeQuantity(cart.cartId, data.petId, data.quantity);
    }

    @Post('makeOrder')
    @UseGuards(RoleCheckerGuard)
    @allowToRoles("user", "admin")
    async makeOrder(@Req() req: Request): Promise<Order | ApiResponse> {
    const cart = await this.getActiveCartForUserId(req.token.id);
    
    const totalPrice = req.body.totalPrice;

    return await this.orderService.add(cart.cartId, totalPrice);
    }

    @Delete(':cartPetId')
    @UseGuards(RoleCheckerGuard)
    @allowToRoles("user", "admin")
    async removeFromCart(@Param('cartPetId') cartPetId: number, @Req() req: Request): Promise<Cart> {
        const cart = await this.getActiveCartForUserId(req.token.id);
        await this.cartService.removePetFromCart(cart.cartId, cartPetId);
        return await this.cartService.getById(cart.cartId);
    }
    
}