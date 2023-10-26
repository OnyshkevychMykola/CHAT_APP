import { Injectable } from '@angular/core';
import {ChatSocket} from "../socket/chat-socket";
import {UserI} from "../../model/user.interface";
import {RoomI, RoomPaginateI} from "../../model/chat-room.interface";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: ChatSocket) { }

  sendMessage() {
  }

  getMessage() {
    return this.socket.fromEvent('message');
  }

  getMyRooms() {
    return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  createRoom() {
    const user2: UserI = {
      id: 3
    };

    const room: RoomI = {
      name: 'Testroom',
      users: [user2]
    }

    this.socket.emit('createRoom', room);
  }
}
