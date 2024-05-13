import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
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
      port: +process.env.PORT,
      password: process.env.PASSWORD,
      username: process.env.USERNAME,
      entities: [User],
      database: process.env.DATABASE,
      synchronize: false,
      ssl: true,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'C473IfQCxy@2024',
      signOptions: { expiresIn: '300s' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
