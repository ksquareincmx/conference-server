import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany
} from "sequelize-typescript";
import { BaseModel } from "../libraries/BaseModel";
import { BookingAttendee } from "./BookingAttendee";
import { User } from "./User";
import { Room } from "./Room";

@Table({
  tableName: "booking"
})
export class Booking extends BaseModel<Booking> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null
  })
  description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  start: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW
  })
  end: Date;

  // id from google calendar
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null
  })
  eventId: string;

  @ForeignKey(() => Room)
  @Column
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => BookingAttendee)
  bookingAttendee: BookingAttendee[];
}
