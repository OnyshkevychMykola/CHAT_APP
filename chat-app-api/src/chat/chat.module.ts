import { Module } from '@nestjs/common';
import { ChatService } from './services/chat/chat.service';
import { ChatGateway } from './chat.gateway';
import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoomEntity} from "./entities/room/room.entity";
import { ConnectedUserService } from './services/connected-user/connected-user.service';
import {ConnectedUserEntity} from "./entities/connected-user/connected-user.entity";
import { MessageService } from './services/message/message.service';
import { JoinedRoomService } from './services/joined-room/joined-room.service';
import {MessageEntity} from "./entities/message/message.entity";
import {JoinedRoomEntity} from "./entities/joined-room/joined-room.entity";


@Module({
  imports: [AuthModule,
    UserModule,
    TypeOrmModule.forFeature([
      RoomEntity,
      ConnectedUserEntity,
      MessageEntity,
      JoinedRoomEntity
    ]), ],
  providers: [ChatGateway, ChatService, ConnectedUserService, MessageService, JoinedRoomService]
})
export class ChatModule {}
