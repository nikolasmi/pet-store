import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddUserDto } from "src/dtos/user/add.user.dto";
import { User } from "src/entities/User";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly user: Repository<User>
    ) {}

    getAll(): Promise<User[]> {
        return this.user.find();
    }

    getById(id: number): Promise<User> {
        return this.user.findOne({where: {userId: id}})
    }

    async getByEmail(email: string): Promise<User | null> {
        const user = await this.user.findOne({where: {email: email}});

        if(user) {
            return user;
        }

        return null;
    }

    add(data: AddUserDto): Promise<User | ApiResponse> {
        const crypto = require('crypto');
    
        if (!data.pasword) {
            return Promise.resolve(new ApiResponse("error", -1002, "Password is required."));
        }
    
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.pasword);
    
        const passwordHashString = passwordHash.digest('hex').toUpperCase();
    
        let newUser: User = new User();
        newUser.email = data.email;
        newUser.pasword = passwordHashString;
        newUser.address = data.address;
        newUser.name = data.name;
        newUser.phone = data.phone;
        newUser.favoriteType = data.favoriteType;
    
        return new Promise((resolve) => {
            this.user.save(newUser)
                .then(data => resolve(data))
                .catch(error => {
                    const response: ApiResponse = new ApiResponse("error", -1001, "Failed to save user.");
                    resolve(response); 
                });
        });
    }

    async editById(id: number, data: Partial<AddUserDto>): Promise<User | ApiResponse> {
        let user: User = await this.user.findOne({ where: { userId: id } });
    
        if (!user) {
            return new ApiResponse("error", -1002, "User not found.");
        }
    
        if (data.pasword) {
            const crypto = require('crypto');
            const passwordHash = crypto.createHash('sha512');
            passwordHash.update(data.pasword);
            const passwordHashString = passwordHash.digest('hex').toUpperCase();
            user.pasword = passwordHashString;
        }
    
        if (data.email) user.email = data.email;
        if (data.address) user.address = data.address;
        if (data.name) user.name = data.name;
        if (data.phone) user.phone = data.phone;
        if (data.favoriteType) user.favoriteType = data.favoriteType;
    
        try {
            return await this.user.save(user);
        } catch (error) {
            return new ApiResponse("error", -1003, "Failed to update user.");
        }
    }
}