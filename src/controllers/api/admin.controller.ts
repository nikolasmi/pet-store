import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Admin } from "entities/admin.entity";
import { AddAdminDto } from "src/dtos/admin/add.admin.dto";
import { EditAdminDto } from "src/dtos/admin/edit.admin.dto";
import { AdminService } from "src/services/admin/admin.service";


@Controller('api/admin')
export class AdminController {
    constructor(
        private adminService: AdminService
    ) { }

    
    @Get()
    getAll(): Promise<Admin[]>{
      return this.adminService.getAll();
    }
    
    @Get(':id')
    getById( @Param('id') adminId: number): Promise<Admin>{
      return this.adminService.getById(adminId);
    }

    @Put()
    add( @Body() data: AddAdminDto ): Promise<Admin> {
        return this.adminService.add(data);
    }

    @Post(':id')
    edit( @Param('id') id: number, @Body() data: EditAdminDto ): Promise<Admin> {
        return this.adminService.editById(id, data);
    }
}