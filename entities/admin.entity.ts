import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn({name: 'admin_id', type: 'int', unsigned: true})
    adminId: number;

    @Column({type: 'varchar', length: '64'})
    username: string;

    @Column({type: 'varchar', length: '255'})
    password: string;
}