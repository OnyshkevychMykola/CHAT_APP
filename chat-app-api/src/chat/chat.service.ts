import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import {RoomI} from "./entities/room.interface";
import {RoomEntity} from "./entities/room.entity";
import {UserI} from "../user/entities/user.interface";

@Injectable()
export class ChatService {


    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>
    ) { }

    async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
        const newRoom = await this.addCreatorToRoom(room, creator);
        return this.roomRepository.save(newRoom);
    }

    async getRoomsForUser(userId: number, options: IPaginationOptions): Promise<Pagination<RoomI>> {
        const query = this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('room.users', 'user')
            .where('user.id = :userId', {userId})

        return paginate(query, options);
    }

    async addCreatorToRoom(room: RoomI, creator: UserI): Promise<RoomI> {
        room.users.push(creator);
        return room;
    }

}
