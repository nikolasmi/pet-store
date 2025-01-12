import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { AdminService } from './services/admin/admin.service';
import { AdminController } from './controllers/api/admin.controller';
import { UserController } from './controllers/api/user.controller';
import { UserService } from './services/user/user.service';
import { PetService } from './services/pet/pet.service';
import { PetController } from './controllers/api/pet.controller';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { CartService } from './services/cart/cart.service';
import { Admin } from './entities/Admin';
import { Order } from './entities/Order';
import { OrderItems } from './entities/OrderItems';
import { Pet } from './entities/Pet';
import { Review } from './entities/Review';
import { User } from './entities/User';
import { Cart } from './entities/Cart';
import { CartPet } from './entities/CartPet';
import { UserCartController } from './controllers/api/user.cart.controller';
import { OrderService } from './services/order/order.service';
import { AdminOrderController } from './controllers/api/admin.order.controller';
import { ReviewService } from './services/review/review.service';
import { ReviewController } from './controllers/api/review.controller';

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
        Cart,
        CartPet,
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
      Pet,
      Order,
      OrderItems,
      Cart,
      CartPet,
      Review
    ])
  ],
  controllers: [AppController, AdminController, UserController, ReviewController , PetController, AuthController, UserCartController, AdminOrderController],
  providers: [AdminService, UserService, PetService, CartService, OrderService, ReviewService],
  exports: [AdminService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .exclude('auth/*')
    .exclude('api/user')
    .exclude('api/pet')
    .forRoutes('api/cart', 'api/order', 'api/review')
  }
}
