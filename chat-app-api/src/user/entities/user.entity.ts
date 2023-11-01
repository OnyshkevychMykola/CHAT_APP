import {BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {RoomEntity} from "../../chat/entities/room/room.entity";
import {ConnectedUserEntity} from "../../chat/entities/connected-user/connected-user.entity";
import {JoinedRoomEntity} from "../../chat/entities/joined-room/joined-room.entity";
import {MessageEntity} from "../../chat/entities/message/message.entity";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column({select: false})
    password: string;

    @ManyToMany(() => RoomEntity, room => room.users)
    rooms: RoomEntity[];

    @OneToMany(() => ConnectedUserEntity, connection => connection.user)
    connections: ConnectedUserEntity[];

    @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
    joinedRooms: JoinedRoomEntity[];

    @OneToMany(() => MessageEntity, message => message.user)
    messages: MessageEntity[];

    @BeforeInsert()
    @BeforeUpdate()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
        this.username = this.username.toLowerCase();
    }

}
