import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin) 
        private readonly admin: Repository<Admin>,
    ) {}

    getAll(): Promise<Admin[]> {
        return this.admin.find();
    }

    getById(id: number): Promise<Admin> {
        return this.admin.findOne({ where: { adminId: id } });
    }
}
