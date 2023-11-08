import { UserI } from 'src/user/entities/user.interface';

export interface ConnectedUserI {
  id?: number;
  socketId: string;
  user: UserI;
}
