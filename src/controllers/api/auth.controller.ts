import { Body, Controller, Post, Req } from "@nestjs/common";
import { LoginAdminDto } from "src/dtos/admin/login.admin.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { AdminService } from "src/services/admin/admin.service";
import * as crypto from 'crypto';
import { LoginInfoAdminDto } from "src/dtos/admin/login.info.admin.dto";
import * as jwt from "jsonwebtoken";
import { JwtDataAdminDto } from "src/dtos/admin/jwt.data.admin.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";

@Controller('auth')
export class AuthController {
    constructor(
        public adminService: AdminService
    ) { }

    @Post('login')
    async doLogin(@Body() data: LoginAdminDto, @Req() req: Request): Promise<LoginInfoAdminDto | ApiResponse> {
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

        const jwtData = new JwtDataAdminDto()
            jwtData.adminId = admin.adminId;
            jwtData.username = admin.username;

            let sada = new Date();
            sada.setDate(sada.getDate() + 14);
            const istekTimestamp = sada.getTime() / 1000;
            jwtData.exp = istekTimestamp;

            jwtData.ip = req.ip.toString();
            jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoAdminDto(
            admin.adminId,
            admin.username,
            token
        );

        return new Promise(resolve => resolve(responseObject))
    }

}