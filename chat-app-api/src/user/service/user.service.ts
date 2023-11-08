import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserI } from 'src/user/entities/user.interface';
import { Like, Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async create(newUser: UserI): Promise<UserI> {
    if (await this.mailExists(newUser.email)) {
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    }

    newUser.password = await this.hashPassword(newUser.password);
    const user = await this.userRepository.save(
      this.userRepository.create(newUser),
    );
    return this.findOne(user.id);
  }

  async login(user: UserI): Promise<string> {
    const foundUser: UserI = await this.findByEmail(user.email.toLowerCase());

    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const matches: boolean = await this.validatePassword(
      user.password,
      foundUser.password,
    );

    if (matches) {
      const payload: UserI = await this.findOne(foundUser.id);
      return this.authService.generateJwt(payload);
    } else {
      throw new HttpException(
        'Login was not successful, wrong credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<UserI>> {
    return paginate<UserEntity>(this.userRepository, options);
  }

  async findAllByUsername(username: string): Promise<UserI[]> {
    return this.userRepository.find({
      where: {
        username: Like(`%${username.toLowerCase()}%`),
      },
    });
  }

  private async findByEmail(email: string): Promise<UserI> {
    return this.userRepository.findOne(
      { email },
      { select: ['id', 'email', 'username', 'password'] },
    );
  }

  private async hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  private async validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }

  private async findOne(id: number): Promise<UserI> {
    return this.userRepository.findOne({ id });
  }

  public getOne(id: number): Promise<UserI> {
    return this.userRepository.findOneOrFail({ id });
  }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });
    return !!user;
  }
}
