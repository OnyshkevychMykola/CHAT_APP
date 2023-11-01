import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat-service";
import {MatSelectionListChange} from "@angular/material/list";
import {PageEvent} from "@angular/material/paginator";
import {RoomPaginateI} from "../../../model/chat-room.interface";
import {Observable} from "rxjs";
import {UserI} from "../../../model/user.interface";
import {AuthService} from "../../../auth/services/auth-service/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit{
  rooms: Observable<RoomPaginateI> = this.chatService.getMyRooms();

  selectedRoom = null;
  user: UserI = this.authService.getLoggedInUser();
  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    this.chatService.emitPaginateRooms(10, 0);
  }

  ngAfterViewInit() {
    this.chatService.emitPaginateRooms(10, 0);
  }


  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
    this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }
}
