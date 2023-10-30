import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './chat.gateway';
import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoomEntity} from "./entities/room.entity";
import { ConnectedUserService } from './services/connected-user.service';
import {ConnectedUserEntity} from "./entities/connected-user.entity";


@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([RoomEntity, ConnectedUserEntity])],
  providers: [ChatGateway, ChatService, ConnectedUserService]
})
export class ChatModule {}
