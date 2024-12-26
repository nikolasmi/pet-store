export class JwtDataAdminDto {
    adminId: number;
    username: string;
    ext: number; //unix time stamp
    ip: string;
    ua: string;

    toPlainObject() {
        return {
            adminId: this.adminId,
            username: this.username,
            ext: this.ext,
            ip: this.ip,
            ua: this.ua
        }
    }
}