import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MessageI} from "../../entities/message/message.interface";
import {RoomI} from "../../entities/room/room.interface";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {Repository} from "typeorm";
import {MessageEntity} from "../../entities/message/message.entity";


@Injectable()
export class MessageService {


    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>
    ) {}

    async create(message: MessageI): Promise<MessageI> {
        return this.messageRepository.save(this.messageRepository.create(message));
    }

    async findMessagesForRoom(room: RoomI, options: IPaginationOptions): Promise<Pagination<MessageI>> {
        const query = this.messageRepository
            .createQueryBuilder('message')
            .leftJoin('message.room', 'room')
            .where('room.id = :roomId', { roomId: room.id })
            .leftJoinAndSelect('message.user', 'user')
            .orderBy('message.created_at', 'DESC');

        return paginate(query, options);

    }

}
