import { Component, Input } from '@angular/core';
import { MessageI } from 'src/app/model/message.interface';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/auth/services/auth-service/auth.service';
import {RoomI} from "../../../model/room.interface";
import {ChatService} from "../../services/chat.service";

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {

  @Input() message: MessageI;
  @Input() chatRoom: RoomI;
  user: UserI = this.authService.getLoggedInUser();
  edit: boolean = false;

  constructor(private authService: AuthService, private chatService: ChatService) { }

  changeEdit() {
    this.edit = !this.edit
  }

  updateMessage() {
    this.chatService.updateMessage( { text: 'newText', roomId: this.chatRoom.id, messageId: this.message.id });
  }
}
