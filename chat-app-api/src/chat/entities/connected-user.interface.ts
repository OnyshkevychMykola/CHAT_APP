import {UserI} from "../../user/entities/user.interface";

export interface ConnectedUserI {
    id?: number;
    socketId: string;
    user: UserI;
}
