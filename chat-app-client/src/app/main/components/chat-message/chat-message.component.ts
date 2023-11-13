import {Component, Input, OnInit} from '@angular/core';
import { MessageI } from 'src/app/model/message.interface';
import { UserI } from 'src/app/model/user.interface';
import { AuthService } from 'src/app/auth/services/auth-service/auth.service';
import {RoomI} from "../../../model/room.interface";
import {ChatService} from "../../services/chat.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit{

  @Input() message: MessageI;
  @Input() chatRoom: RoomI;
  user: UserI = this.authService.getLoggedInUser();
  edit: boolean = false;
  messageText: FormControl = new FormControl(null, [Validators.required]);

  ngOnInit() {
  }

  constructor(private authService: AuthService, private chatService: ChatService) { }

  changeEdit() {
    if (this.message.user.id !== this.user.id) return;
    this.edit = !this.edit
  }

  updateMessage() {
    if (!this.messageText.value) return
    this.chatService.updateMessage( { text: this.messageText.value, roomId: this.chatRoom.id, messageId: this.message.id });
    this.message.text = this.messageText.value;
    this.edit = !this.edit
  }
}
