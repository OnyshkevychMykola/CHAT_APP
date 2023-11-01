import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {JoinedRoomEntity} from "../../entities/joined-room/joined-room.entity";
import {Repository} from "typeorm";
import {JoinedRoomI} from "../../entities/joined-room/joined-room.interface";
import {UserI} from "../../../user/entities/user.interface";
import {RoomI} from "../../entities/room/room.interface";

@Injectable()
export class JoinedRoomService {

    constructor(
        @InjectRepository(JoinedRoomEntity)
        private readonly joinedRoomRepository: Repository<JoinedRoomEntity>
    ) { }

    async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> {
        return this.joinedRoomRepository.save(joinedRoom);
    }

    async findByUser(user: UserI): Promise<JoinedRoomI[]> {
        return this.joinedRoomRepository.findBy({ user });
    }

    async findByRoom(room: RoomI): Promise<JoinedRoomI[]> {
        return this.joinedRoomRepository.findBy({ room });
    }

    async deleteBySocketId(socketId: string) {
        return this.joinedRoomRepository.delete({ socketId });
    }

    async deleteAll() {
        await this.joinedRoomRepository
            .createQueryBuilder()
            .delete()
            .execute();
    }

}


