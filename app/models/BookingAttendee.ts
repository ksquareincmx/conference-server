import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey
} from "sequelize-typescript";
import { BaseModel } from "../libraries/BaseModel";
import { Attendee } from "./Attendee";
import { Booking } from "./Booking";

@Table({
  tableName: "bookingAttendee"
})
export class BookingAttendee extends BaseModel<BookingAttendee> {
  @ForeignKey(() => Attendee)
  @Column
  emailId: number;

  @BelongsTo(() => Attendee)
  attendee: Attendee;

  @ForeignKey(() => Booking)
  @Column
  bookingId: number;

  @BelongsTo(() => Booking)
  booking: Booking;
}
