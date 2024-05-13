import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from '../../../shared/dto/update-user.dto';
import { User } from '../../../shared/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async viewUser(username: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ username });
    if (user) {
      return { status: 200, user: user };
    } else {
      return { status: 404, user: 'user not found' };
    }
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  async updateUser(
    username: string,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const msg = await this.userRepository.update(
      { username },
      { ...updateUserDto },
    );
    if (msg.affected != 0) {
      return { status: 200, msg: msg };
    } else {
      return { status: 404, msg: 'user not found' };
    }
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  async removeUser(username: string): Promise<any> {
    const msg = await this.userRepository.delete({ username: username });
    if (msg.affected != 0) {
      return { status: 200, msg: msg };
    } else {
      return { status: 404, msg: 'user not found' };
    }
  }
}
