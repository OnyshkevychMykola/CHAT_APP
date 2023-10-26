import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoomEntity} from "./entities/room.entity";


@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([RoomEntity])],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}
