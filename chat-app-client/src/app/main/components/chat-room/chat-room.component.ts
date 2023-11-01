import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {RoomI} from "../../../model/chat-room.interface";
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import {MessagePaginateI} from "../../../model/message.interface";
import {FormControl, Validators} from "@angular/forms";
import {ChatService} from "../../services/chat-service";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnChanges, OnDestroy, AfterViewInit {

  @Input() chatRoom: RoomI;
  @ViewChild('messagesNew') private messagesScroller: ElementRef;

  messagesPaginate$: Observable<MessagePaginateI> = combineLatest([this.chatService.getMessages(),
    this.chatService.getAddedMessage().pipe(startWith(null))]).pipe(
    map(([messagePaginate, message]) => {
      if (message && message.room.id === this.chatRoom.id
        && !messagePaginate.items.some(m => m.id === message.id)) {
        messagePaginate.items.push(message);
      }
      messagePaginate.items = messagePaginate.items
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      return messagePaginate;
    }),
    tap(() => this.scrollToBottom())
  )
  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(private chatService: ChatService) { }

  ngAfterViewInit() {
    console.log('2')
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.chatService.leaveRoom(changes['chatRoom'].previousValue);
    if(this.chatRoom) {
      this.chatService.joinRoom(this.chatRoom);
    }
  }

  ngOnDestroy() {
    this.chatService.leaveRoom(this.chatRoom);
  }

  sendMessage() {
    this.chatService.sendMessage({text: this.chatMessage.value, room: this.chatRoom});
    this.chatMessage.reset();
  }

  scrollToBottom(): void {
    setTimeout(() => {this.messagesScroller.nativeElement.scrollTop = this.messagesScroller.nativeElement.scrollHeight}, 1);
  }
}
