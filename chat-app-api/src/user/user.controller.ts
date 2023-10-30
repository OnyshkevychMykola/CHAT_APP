import {Controller, Get, Post, Body, Query, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {UserI} from "./entities/user.interface";
import {UserHelperService} from "./user-helper.service";
import {Pagination} from "nestjs-typeorm-paginate";
import {LoginUserDto} from "./dto/login-user.dto";
import {LoginResponseI} from "./entities/login.interface";
import {JwtAuthGuard} from "../auth/jwt.guard";

@Controller('user')
export class UserController {
  constructor(
      private userService: UserService,
      private userHelperService: UserHelperService
  ) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserI> {
    const userEntity: UserI = this.userHelperService.createUserDtoToEntity(createUserDto);
    return this.userService.create(userEntity);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<Pagination<UserI>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({ page, limit });
  }

  @Get('/find-by-username')
  async findAllByUsername(@Query('username') username: string) {
    return this.userService.findAllByUsername(username);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseI> {
    const userEntity: UserI = this.userHelperService.loginUserDtoToEntity(loginUserDto);
    const jwt: string = await this.userService.login(userEntity);
    return {
      access_token: jwt,
      token_type: 'JWT',
      expires_in: 10000
    };
  }

}
