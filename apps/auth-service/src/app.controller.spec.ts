import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateUserDto } from '../../../shared/dto/create-user.dto';
import { User } from '../../../shared/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;
  const mockUserRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        age: 25,
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        gender: 'm',
      };
      const user = new User();
      Object.assign(user, createUserDto);
      jest.spyOn(mockUserRepository, 'save').mockReturnValue(user);

      const result = await controller.create(createUserDto);

      expect(result).toBe(user);
    });
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const user = {
        name: 'Test User',
        age: 25,
        username: 'testuser',
        password: 'password',
      };
      const accessToken = 'generated-access-token';
      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(user);
      jest.spyOn(mockJwtService, 'sign').mockReturnValue(accessToken);

      const result = await controller.login(user);

      expect(result).toEqual({
        status: 200,
        access_token: accessToken,
      });
    });

    it('should return status 400 for invalid credentials', async () => {
      const user = {
        username: 'invaliduser',
        password: 'invalidpassword',
      };
      jest.spyOn(service, 'login').mockResolvedValue({
        status: 400,
        msg: 'Invalid credentials',
      });

      const result = await controller.login(user);

      expect(result).toEqual({
        status: 400,
        msg: 'Invalid credentials',
      });
    });
  });
});
