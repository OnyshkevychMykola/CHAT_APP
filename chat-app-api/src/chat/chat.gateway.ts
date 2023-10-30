import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Socket, Server} from 'socket.io';
import {OnModuleInit, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import {UserService} from "../user/user.service";
import {UserI} from "../user/entities/user.interface";
import {ChatService} from "./services/chat.service";
import {RoomI} from "./entities/room.interface";
import {PageI} from "./entities/page.interface";
import {ConnectedUserService} from "./services/connected-user.service";
import {ConnectedUserI} from "./entities/connected-user.interface";

@WebSocketGateway({ cors: { origin: ['http://localhost:3000', 'http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit  {

  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
      private authService: AuthService,
      private userService: UserService,
      private chatService: ChatService,
      private connectedUserService: ConnectedUserService) { }

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
  }


  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
      const user: UserI = await this.userService.getOne(decodedToken.user.id);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.chatService.getRoomsForUser(user.id, { page: 1, limit: 10 });
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        await this.connectedUserService.create({ socketId: socket.id, user });
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    const createdRoom: RoomI = await this.chatService.createRoom(room, socket.data.user);

    for (const user of createdRoom.users) {
      const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
      const rooms = await this.chatService.getRoomsForUser(user.id, {page: 1, limit: 10});
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }


  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(socket: Socket, page: PageI) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    page.page = page.page + 1;
    const rooms = await this.chatService.getRoomsForUser(socket.data.user.id, page);
    rooms.meta.currentPage = rooms.meta.currentPage - 1;
    return this.server.to(socket.id).emit('rooms', rooms);
  }


}
