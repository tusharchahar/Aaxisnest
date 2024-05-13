import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../../../shared/dto/create-user.dto';
import { User } from '../../../shared/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  createUser(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.name = createUserDto.name;
    user.age = createUserDto.age;
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.gender = createUserDto.gender;
    return this.userRepository.save(user);
  }

  //function to login user and return access_token
  async login(user: any): Promise<Record<string, any>> {
    // Get user information
    const userDetails = await this.userRepository.findOne({
      where: { username: user.username },
    });
    if (userDetails == null) {
      return { status: 400, msg: 'Invalid credentials' };
    }

    // Check if the given password match with saved password
    const isValid = user.password === userDetails.password ? true : false;
    if (isValid) {
      return {
        status: 200,
        access_token: this.jwtService.sign({ email: user.email }),
      };
    } else {
      return { status: 400, msg: 'Invalid credentials' };
    }
  }
}
