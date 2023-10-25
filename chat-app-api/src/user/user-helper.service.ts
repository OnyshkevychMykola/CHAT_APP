import { Injectable } from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UserI} from "./entities/user.interface";
import {LoginUserDto} from "./dto/login-user.dto";

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
