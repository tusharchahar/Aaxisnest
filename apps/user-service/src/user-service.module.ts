import { Module } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserService } from './user-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
} else if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: 5432,
      password: process.env.PASSWORD,
      username: process.env.USERNAME,
      entities: [User],
      database: process.env.DATABASE,
      synchronize: false,
      ssl: true,
    }),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UserServiceController],
  providers: [UserService, JwtService],
})
export class UserServiceModule {}
