import { Injectable } from '@angular/core';
import {ChatSocket} from "../socket/chat-socket";
import {UserI} from "../../model/user.interface";
import {RoomI, RoomPaginateI} from "../../model/chat-room.interface";
import {Observable} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MessageI, MessagePaginateI} from "../../model/message.interface";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: ChatSocket, private snackbar: MatSnackBar) {
  }

  getAddedMessage(): Observable<MessageI> {
    return this.socket.fromEvent<MessageI>('messageAdded');
  }

  sendMessage(message: MessageI) {
    this.socket.emit('addMessage', message);
  }

  joinRoom(room: RoomI) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room: RoomI) {
    this.socket.emit('leaveRoom', room);
  }

  getMessages(): Observable<MessagePaginateI> {
    return this.socket.fromEvent<MessagePaginateI>('messages');
  }

  getMyRooms(): Observable<RoomPaginateI> {
    return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms', {limit, page});
  }

  createRoom(room: RoomI) {
    this.socket.emit('createRoom', room);
    this.snackbar.open(`Room ${room.name} created successfully`, 'Close', {
      duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
    });
  }
}
