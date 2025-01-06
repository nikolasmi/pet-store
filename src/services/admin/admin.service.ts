import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddAdminDto } from 'src/dtos/admin/add.admin.dto';
import { EditAdminDto } from 'src/dtos/admin/edit.admin.dto';
import { Admin } from 'src/entities/Admin';
import { ApiResponse } from 'src/misc/api.response.class';
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

    async getByUsername(username: string): Promise<Admin | null> {
        const admin = await this.admin.findOne({where: {username: username}});

        if(admin) {
            return admin;
        }

        return null;
    }

    add(data: AddAdminDto): Promise<Admin | ApiResponse> {
        const crypto = require('crypto');

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        let newAdmin: Admin = new Admin();
        newAdmin.username = data.username;
        newAdmin.password = passwordHashString;

        return new Promise((resolve) => {
            this.admin.save(newAdmin).then(data => resolve(data)).catch(error => {
                const response: ApiResponse = new ApiResponse("error", -1001) 
            })
        });
    }

    async editById(id: number, data: EditAdminDto): Promise<Admin | ApiResponse> {
        let admin: Admin = await this.admin.findOne({ where: { adminId: id } });

        if(admin === undefined){
            return new Promise((resolve) => {
                resolve(new ApiResponse("error", -1002))
            })
        }

        const crypto = require('crypto');
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        admin.password = passwordHashString;

        return this.admin.save(admin);
    }

}
