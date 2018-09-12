import { Table, Column, DataType, HasMany } from "sequelize-typescript";
import { BaseModel } from "../libraries/BaseModel";
import { Booking } from "./Booking";

@Table({
  tableName: "room"
})
export class Room extends BaseModel<Room> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null
  })
  name: string;

  // The color to show in the UI for this room
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null
  })
  color: string;

  // If there is someone in the room
  // (For future sensor integration)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
  presence: boolean;

  @HasMany(() => Booking)
  bookings: Booking[];
}
