import { Body, Controller, Post, Req } from "@nestjs/common";
import { LoginAdminDto } from "src/dtos/admin/login.admin.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { AdminService } from "src/services/admin/admin.service";
import * as crypto from 'crypto';
import { LoginInfoDto } from "src/dtos/auth/login.info.dto";
import * as jwt from "jsonwebtoken";
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";
import { AddUserDto } from "src/dtos/user/add.user.dto";
import { UserService } from "src/services/user/user.service";
import { LoginUserDto } from "src/dtos/user/login.user.dto";

@Controller('auth')
export class AuthController {
    constructor(
        public adminService: AdminService,
        public userService: UserService
    ) { }

    @Post('admin/login')
    async doAdminLogin(@Body() data: LoginAdminDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const admin = await this.adminService.getByUsername(data.username)
        
        if(!admin) {
            return new Promise(resolve => {
                resolve(new ApiResponse("error", -1004, "can not find admin"))
            })
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if(admin.password !== passwordHashString){
            return new Promise(resolve => resolve(new ApiResponse("error", -1004)))
        }

        //adminID, username,exp, ip, ua token(JWT)

        const jwtData = new JwtDataDto()
            jwtData.role = "admin";
            jwtData.id = admin.adminId;
            jwtData.identity = admin.username;

            let sada = new Date();
            sada.setDate(sada.getDate() + 14);
            const istekTimestamp = sada.getTime() / 1000;
            jwtData.exp = istekTimestamp;

            jwtData.ip = req.ip.toString();
            jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            admin.adminId,
            admin.username,
            token
        );

        return new Promise(resolve => resolve(responseObject))
    }

    @Post('user/register')
    async userRegister(@Body() data: AddUserDto) {
        return await this.userService.add(data)
    }

    @Post('user/login')
    async doUserLogin(@Body() data: LoginUserDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const user = await this.userService.getByEmail(data.email)
        
        if(!user) {
            return new Promise(resolve => {
                resolve(new ApiResponse("error", -1004, "can not find user"))
            })
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.pasword);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if(user.pasword !== passwordHashString){
            return new Promise(resolve => resolve(new ApiResponse("error", -1004,"error creating user")))
        }

        const jwtData = new JwtDataDto()
            jwtData.role = "user";
            jwtData.id = user.userId;
            jwtData.identity = user.email;

            let sada = new Date();
            sada.setDate(sada.getDate() + 14);
            const istekTimestamp = sada.getTime() / 1000;
            jwtData.exp = istekTimestamp;

            jwtData.ip = req.ip.toString();
            jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            user.userId,
            user.email,
            token
        );

        return new Promise(resolve => resolve(responseObject))
    }


}