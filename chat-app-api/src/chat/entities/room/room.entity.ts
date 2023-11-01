import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "../../../user/entities/user.entity";
import {JoinedRoomEntity} from "../joined-room/joined-room.entity";
import {MessageEntity} from "../message/message.entity";

@Entity()
export class RoomEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    users: UserEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
    joinedUsers: JoinedRoomEntity[];

    @OneToMany(() => MessageEntity, message => message.room)
    messages: MessageEntity[];

}
