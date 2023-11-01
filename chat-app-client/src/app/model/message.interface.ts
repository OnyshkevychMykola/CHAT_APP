import { Meta } from "@angular/platform-browser";
import { UserI } from "./user.interface";
import {RoomI} from "./chat-room.interface";

export interface MessageI {
  id?: number;
  text: string;
  user?: UserI;
  room: RoomI;
  created_at?: Date;
  updated_at?: Date;
}

export interface MessagePaginateI {
  items: MessageI[];
  meta: Meta;
}
