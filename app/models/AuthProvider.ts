import { Table, Column, DataType, BelongsTo } from "sequelize-typescript";
import { BaseModel } from "../libraries/BaseModel";

@Table({
  tableName: "authProvider"
})
export class AuthProvider extends BaseModel<AuthProvider> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null
  })
  providerName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null
  })
  providerId: string;
}
