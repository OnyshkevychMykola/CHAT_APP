import { UserI } from 'src/user/entities/user.interface';

export interface RoomI {
  id?: number;
  name?: string;
  description?: string;
  users?: UserI[];
  created_at?: Date;
  updated_at?: Date;
}
