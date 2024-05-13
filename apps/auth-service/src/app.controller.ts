import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from '../../../shared/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.appService.createUser(createUserDto);
  }

  /**
   * I have used get decorator to login
   * so the API URL will be
   * GET http://localhost:3000?username={username}&password={password}
   */
  @Get('login')
  async login(@Query() query: any) {
    const data = await this.appService.login(query);
    return data;
  }
}
