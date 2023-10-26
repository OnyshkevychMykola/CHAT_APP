import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Socket, Server} from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {UserService} from "../user/user.service";
import {UserI} from "../user/entities/user.interface";
import {ChatService} from "./chat.service";
import {RoomI} from "./entities/room.interface";

@WebSocketGateway({ cors: { origin: ['http://localhost:3000', 'http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(private authService: AuthService, private userService: UserService,
              private chatService: ChatService) {}
  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
      const user: UserI = await this.userService.getOne(decodedToken.user.id);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.chatService.getRoomsForUser(user.id, {page: 1, limit: 10});
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI): Promise<RoomI> {
    return this.chatService.createRoom(room, socket.data.user)
  }


}
