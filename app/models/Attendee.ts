import { Table, Column, DataType, HasMany} from "sequelize-typescript";
import { BaseModel } from "../libraries/BaseModel";
import { BookingAttendee } from "./BookingAttendee";

@Table({
  tableName: "attendee"
})
export class Attendee extends BaseModel<Attendee>{
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null
  })
  email: string;

  @HasMany(() => BookingAttendee)
  bookingAttendee: BookingAttendee[];
}
