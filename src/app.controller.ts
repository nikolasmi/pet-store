import { Controller, Get } from '@nestjs/common';
import { Admin } from 'entities/admin.entity';
import { AdminService } from './services/admin/admin.service';

@Controller()
export class AppController {
  constructor(
    private adminService: AdminService
  ) {}

  @Get()
  getIndex(): string {
    return 'Home page!';
  }

  @Get('api/admin')
  getAllAdmins(): Promise<Admin[]>{
    return this.adminService.getAll();
  }
}
