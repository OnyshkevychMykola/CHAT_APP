import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import {RoomI} from "../../entities/room/room.interface";
import {RoomEntity} from "../../entities/room/room.entity";
import {UserI} from "../../../user/entities/user.interface";

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

    async getRoom(roomId: number): Promise<RoomI> {
        return await this.roomRepository.findOne({
            where: {id: roomId},
            relations: ['users'],
        })
    }


    async getRoomsForUser(userId: number, options: IPaginationOptions): Promise<Pagination<RoomI>> {
        const query = this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('room.users', 'user')
            .where('user.id = :userId', {userId})
            .leftJoinAndSelect('room.users', 'all_users')
            .orderBy('room.updated_at', 'DESC');
        return paginate(query, options);
    }

    async addCreatorToRoom(room: RoomI, creator: UserI): Promise<RoomI> {
        const foundUser = room.users.find((user) => user.email === creator.email);
        if (foundUser === undefined) {
            room.users.push(creator);
        }
        return room;
    }

}
