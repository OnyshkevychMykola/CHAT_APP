import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { MessageEntity } from 'src/chat/entities/message/message.entity';
import { MessageI } from 'src/chat/entities/message/message.interface';
import { RoomI } from 'src/chat/entities/room/room.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(message: MessageI): Promise<MessageI> {
    return this.messageRepository.save(this.messageRepository.create(message));
  }

  async findMessagesForRoom(
    room: RoomI,
    options: IPaginationOptions,
  ): Promise<Pagination<MessageI>> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.room', 'room')
      .where('room.id = :roomId', { roomId: room.id })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.created_at', 'DESC');

    return paginate(query, options);
  }

  async update(data: any): Promise<MessageI> {
    const message = (await this.messageRepository.findOne({
      where: { id: data.messageId },
    })) as MessageI;
    if (!message) {
      throw new NotFoundException(
        `Message with id ${data.messageId} not found`,
      );
    }
    message.text = data.text;
    await this.messageRepository.save(message);

    return message;
  }
}
