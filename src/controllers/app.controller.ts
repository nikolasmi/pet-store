import { Controller, Get } from '@nestjs/common';
import { AdminService } from '../services/admin/admin.service';

@Controller()
export class AppController {
  constructor(
    private adminService: AdminService
  ) {}

  @Get()
  getIndex(): string {
    return 'Home page!';
  }
}
