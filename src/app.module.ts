import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Admin } from 'entities/admin.entity';
import { AdminService } from './services/admin/admin.service';
import { Order } from 'entities/order.entity';
import { OrderItems } from 'entities/orderItems.entity';
import { Pet } from 'entities/pet.entity';
import { Review } from 'entities/review.entity';
import { User } from 'entities/user.entity';
import { AdminController } from './controllers/api/admin.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Admin,
        Order,
        OrderItems,
        Pet,
        Review,
        User
      ]
    }),
    TypeOrmModule.forFeature([ Admin ])
  ],
  controllers: [AppController, AdminController],
  providers: [AdminService],
})
export class AppModule {}
