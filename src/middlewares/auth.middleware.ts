import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AdminService } from "src/services/admin/admin.service";
import * as jwt from 'jsonwebtoken';
import { JwtDataAdminDto } from "src/dtos/admin/jwt.data.admin.dto";
import { jwtSecret } from "config/jwt.secret";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private adminService: AdminService) { }
    
    async use(req: Request, res: Response, next: NextFunction) {
        
        if(!req.headers.authorization) {
            throw new HttpException('token not found', HttpStatus.UNAUTHORIZED);
        }

        const token = req.headers.authorization;

        const tokenParts = token.split(' ');
        if(tokenParts.length !== 2) {
            throw new HttpException('token not found', HttpStatus.UNAUTHORIZED);
        }

        const tokenString = tokenParts[1]

        let jwtData: JwtDataAdminDto;
        try {
            jwtData = jwt.verify(tokenString, jwtSecret);
        } catch (e) {
            throw new HttpException('bad token found', HttpStatus.UNAUTHORIZED); 
        }

        if(!jwtData) {
            throw new HttpException('token not found', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.ip !== req.ip.toString()) {
            throw new HttpException('bad token found', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.ua !== req.headers["user-agent"]) {
            throw new HttpException('bad token found', HttpStatus.UNAUTHORIZED);
        }

        const admin = await this.adminService.getById(jwtData.adminId);
        if (!admin) {
            throw new HttpException('admin not found', HttpStatus.UNAUTHORIZED);
        }

        const trenutniTimestamp = new Date().getTime() / 1000;
        if(trenutniTimestamp >= jwtData.exp) {
            throw new HttpException('token expired', HttpStatus.UNAUTHORIZED);
        }

        next();
    }

}