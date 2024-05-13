import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceController } from './user-service.controller';
import { UserService } from './user-service.service';
import { UpdateUserDto } from '../../../shared/dto/update-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../shared/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('UserServiceController', () => {
  let controller: UserServiceController;
  const mockUserRepository = {
    update: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserServiceController],
      providers: [
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UserServiceController>(UserServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return user with status 200 if user exists', async () => {
      const username = 'testuser';
      const user = { username: username };
      jest.spyOn(mockUserRepository, 'findOneBy').mockReturnValue(user);

      const result = await controller.findOne(username);

      expect(result).toEqual({ status: 200, user });
    });

    it('should return status 404 if user does not exist', async () => {
      const username = 'nonexistentuser';
      jest.spyOn(mockUserRepository, 'findOneBy').mockReturnValue(null);

      const result = await controller.findOne(username);

      expect(result).toEqual({ status: 404, user: 'user not found' });
    });
  });

  describe('update', () => {
    it('should update user and return status 200 if user exists', async () => {
      const username = 'testuser';
      const updateUserDto: UpdateUserDto = {
        /* Update user data here */
      };
      const msg = { affected: 1 };
      jest.spyOn(mockUserRepository, 'update').mockReturnValue(msg);
      //jest.spyOn(service, 'updateUser').mockResolvedValue({ status: 200, msg });

      const result = await controller.update(username, updateUserDto);

      expect(result).toEqual({ status: 200, msg });
    });

    it('should return status 404 if user does not exist', async () => {
      const username = 'nonexistentuser';
      const updateUserDto: UpdateUserDto = {
        /* Update user data here */
      };
      jest.spyOn(mockUserRepository, 'update').mockReturnValue({ affected: 0 });

      const result = await controller.update(username, updateUserDto);

      expect(result).toEqual({ status: 404, msg: 'user not found' });
    });
  });

  describe('remove', () => {
    it('should remove user and return status 200 if user exists', async () => {
      const username = 'testuser';
      const msg = { affected: 1 };
      jest.spyOn(mockUserRepository, 'delete').mockReturnValue({ affected: 1 });

      const result = await controller.remove(username);

      expect(result).toEqual({ status: 200, msg });
    });

    it('should return status 404 if user does not exist', async () => {
      const username = 'nonexistentuser';
      jest.spyOn(mockUserRepository, 'delete').mockReturnValue({ affected: 0 });

      const result = await controller.remove(username);

      expect(result).toEqual({ status: 404, msg: 'user not found' });
    });
  });
});
