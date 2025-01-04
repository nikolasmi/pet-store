import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Admin } from 'src/entities/admin.entity';
import { AdminService } from './services/admin/admin.service';
import { Order } from 'src/entities/order.entity';
import { OrderItems } from 'src/entities/orderItems.entity';
import { Pet } from 'src/entities/pet.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { AdminController } from './controllers/api/admin.controller';
import { UserController } from './controllers/api/user.controller';
import { UserService } from './services/user/user.service';
import { PetService } from './services/pet/pet.service';
import { PetController } from './controllers/api/pet.controller';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';

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
    TypeOrmModule.forFeature([ 
      Admin,
      User,
      Pet
    ])
  ],
  controllers: [AppController, AdminController, UserController, PetController, AuthController],
  providers: [AdminService, UserService, PetService],
  exports: [AdminService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/*')
      .forRoutes('api/*')
  }
}
