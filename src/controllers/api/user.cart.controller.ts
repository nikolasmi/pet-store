import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
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
    //@SetMetadata('allow_to_roles', ['admin', 'user'])
    @UseGuards(RoleCheckerGuard)
    @allowToRoles('admin', 'user')
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
        return await this.orderService.add(cart.cartId);
    }
    
}