import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Admin } from "entities/admin.entity";
import { AddAdminDto } from "src/dtos/admin/add.admin.dto";
import { EditAdminDto } from "src/dtos/admin/edit.admin.dto";
import { ApiResponse } from "src/misc/api.response.class";
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
    getById( @Param('id') adminId: number): Promise<Admin | ApiResponse>{
      return new Promise(async(resolve) => {
        let admin = await this.adminService.getById(adminId);
        if(admin === undefined){
          resolve(new ApiResponse("error", -1002));
        }

        resolve(admin);
      });
    }

    @Put()
    add( @Body() data: AddAdminDto ): Promise<Admin | ApiResponse>{
        return this.adminService.add(data);
    }

    @Post(':id')
    edit( @Param('id') id: number, @Body() data: EditAdminDto ): Promise<Admin | ApiResponse> {
        return this.adminService.editById(id, data);
    }
}