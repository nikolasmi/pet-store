export class LoginInfoAdminDto {
    adminId: number;
    username: string;
    token: string;

    constructor(id: number, username: string, jwt: string) {
        this.adminId = id;
        this. username = username,
        this.token = jwt;
    }
}