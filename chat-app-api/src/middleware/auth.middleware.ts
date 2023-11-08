import {
  UnauthorizedException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/service/auth.service';
import { UserI } from 'src/user/entities/user.interface';
import { UserService } from 'src/user/service/user.service';

export interface RequestModel extends Request {
  user: UserI;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (token) {
        const user = await this.userService.getOne(
          (
            await this.authService.verifyJwt(token)
          ).user.id,
        );
        if (user) {
          req.user = user;
          return next();
        }
      }
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Unauthorized');
    }
    throw new UnauthorizedException('Unauthorized');
  }
}
