import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { UserHelperService } from './service/user-helper.service';
import { UserService } from './service/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService, UserHelperService],
  exports: [UserService, UserHelperService]
})
export class UserModule {}
