import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { ChangeOrderStatus } from "src/dtos/order/change.order.status.dto";
import { Order } from "src/entities/Order";
import { allowToRoles } from "src/misc/allow.to.roles.descriptor";
import { ApiResponse } from "src/misc/api.response.class";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { OrderService } from "src/services/order/order.service";

@Controller('api/order')
export class AdminOrderController {
    constructor(
        private orderService: OrderService,
    ) {}

    @Get(':id')
    @UseGuards(RoleCheckerGuard)
    @allowToRoles('admin', 'user')
    async get(@Param('id') id:number, @Req() req: Request): Promise<Order | ApiResponse> {
        const order = await this.orderService.getById(id);

        if(!order) {
            return new ApiResponse('error', -9001, "order not found")
        }

        // Korisnik sme da vidi samo svoju porudžbinu; admin sme sve
        if (req.token.role === 'user' && order.cart?.user?.userId !== req.token.id) {
            return new ApiResponse('error', -9003, "not authorized for this order");
        }

        return order;
    }

    @Get('user/:userId')
    @UseGuards(RoleCheckerGuard)
    @allowToRoles('admin', 'user')
    async getOrdersForUser(@Req() req: Request): Promise<Order[] | ApiResponse> {
        // ID se uzima iz tokena, ne iz URL-a — korisnik vidi isključivo svoje porudžbine
        return await this.orderService.getOrdersForUser(req.token.id);
    }

    @Patch(':id')
    @UseGuards(RoleCheckerGuard)
    @allowToRoles('admin', 'user')
    async changeStatus(@Param('id') id:number, @Body() data: ChangeOrderStatus, @Req() req: Request): Promise<Order | ApiResponse> {
        // Korisnik sme da menja status (npr. otkazivanje) samo svoje porudžbine
        if (req.token.role === 'user') {
            const order = await this.orderService.getById(id);
            if (!order) {
                return new ApiResponse('error', -9001, "order not found");
            }
            if (order.cart?.user?.userId !== req.token.id) {
                return new ApiResponse('error', -9003, "not authorized for this order");
            }
        }
        return await this.orderService.changeStatus(id, data.newStatus);
    }
}
