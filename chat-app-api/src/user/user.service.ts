import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {Repository} from "typeorm";
import {UserI} from "./entities/user.interface";
const bcrypt = require('bcrypt');
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {AuthService} from "../auth/auth.service";

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
      private readonly authService: AuthService,
  ) {
  }

  async create(newUser: UserI): Promise<UserI> {
    try {
      const exists: boolean = await this.mailExists(newUser.email);
      if (!exists) {
        newUser.password = await this.hashPassword(newUser.password);
        const user = await this.userRepository.save(this.userRepository.create(newUser));
        return this.findOne(user.id);
      } else {
        throw new ConflictException('Email is already in use');
      }
    } catch {
      throw new ConflictException('Email is already in use');
    }
  }

  async login(user: UserI): Promise<string> {
    try {
      const foundUser: UserI = await this.findByEmail(user.email.toLowerCase());
      if (foundUser) {
        const matches: boolean = await this.validatePassword(user.password, foundUser.password);
        if (matches) {
          const payload: UserI = await this.findOne(foundUser.id);
          return this.authService.generateJwt(payload);
        } else {
          throw new UnauthorizedException('Login was not successfull, wrong credentials');
        }
      } else {
        throw new UnauthorizedException('Login was not successfull, wrong credentials');
      }
    } catch {
      throw new NotFoundException('User not found');
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<UserI>> {
    return paginate<UserEntity>(this.userRepository, options);
  }

  private async findByEmail(email: string): Promise<UserI> {
    return this.userRepository.findOne({ where: { email }, select: ['id', 'email', 'username', 'password'] });
  }

  private async hashPassword(password: string): Promise<string> {
    return this.authService.hashPassword(password);
  }

  private async validatePassword(password: string, storedPasswordHash: string): Promise<any> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }

  private async findOne(id: number): Promise<UserI> {
    return this.userRepository.findOneBy({ id });
  }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    return !!user;
  }

  async comparePasswords(password: string, storedPasswordHash: string): Promise<any> {
    return bcrypt.compare(password, storedPasswordHash);
  }

  // verifyJwt(jwt: string): Promise<any> {
  //   return this.jwtService.verifyAsync(jwt);
  // }
}
