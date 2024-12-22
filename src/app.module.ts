import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Admin } from 'entities/admin.entity';
import { AdminService } from './services/admin/admin.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [Admin]
    }),
    TypeOrmModule.forFeature([ Admin ])
  ],
  controllers: [AppController],
  providers: [AdminService],
})
export class AppModule {}
