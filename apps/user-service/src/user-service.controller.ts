import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user-service.service';
import { UpdateUserDto } from '../../../shared/dto/update-user.dto';
import { AuthGuard } from '../strategy/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserServiceController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.userService.viewUser(username);
  }
  /**
   * I have used put decorator with id param to get username from request
   * so the API URL will be
   * PUT http://localhost:3000/user/:username
   */
  @Put(':username')
  @UseGuards(AuthGuard)
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(username, updateUserDto);
  }

  /**
   * I have used Delete decorator with username param to get id from request
   * so the API URL will be
   * DELETE http://localhost:3000/user/:username
   */
  @Delete(':username')
  @UseGuards(AuthGuard)
  remove(@Param('username') username: string) {
    return this.userService.removeUser(username);
  }
}
