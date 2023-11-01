import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserI } from 'src/user/entities/user.interface';

@Injectable()
export class UserHelperService {

  createUserDtoToEntity(createUserDto: CreateUserDto): UserI {
    return {
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password
    };
  }

  loginUserDtoToEntity(loginUserDto: LoginUserDto): UserI {
    return {
      email: loginUserDto.email,
      password: loginUserDto.password
    };
  }

}
