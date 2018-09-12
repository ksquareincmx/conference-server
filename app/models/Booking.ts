import { Table, Column, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { BaseModel } from "../libraries/BaseModel";
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
}
