import {Component, OnInit, Input} from '@angular/core';
import {MessageI} from "../../../model/message.interface";
import {UserI} from "../../../model/user.interface";
import {AuthService} from "../../../auth/services/auth-service/auth.service";

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent {

  @Input() message: MessageI;
  user: UserI = this.authService.getLoggedInUser();

  constructor(private authService: AuthService) { }


}
