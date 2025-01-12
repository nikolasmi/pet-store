import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
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
    async get(@Param('id') id:number): Promise<Order | ApiResponse> {
        const order = await this.orderService.getById(id);

        if(!order) {
            return new ApiResponse('error', -9001, "order not found")
        }

        return order;
    }

    @Get('user/:userId')
    @UseGuards(RoleCheckerGuard)
    @allowToRoles('admin', 'user')
    async getOrdersForUser(@Param('id') userId: number): Promise<Order[] | ApiResponse> {
        return await this.orderService.getOrdersForUser(userId);
    }

    @Patch(':id')
    @UseGuards(RoleCheckerGuard)
    @allowToRoles('admin', 'user')
    async changeStatus(@Param('id') id:number, @Body() data: ChangeOrderStatus): Promise<Order | ApiResponse> {
        return await this.orderService.changeStatus(id, data.newStatus);
    }
}