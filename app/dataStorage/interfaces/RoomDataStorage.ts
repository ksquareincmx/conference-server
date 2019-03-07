import {
  IRoom,
  IRoomRequest,
  IUpdateRoom
} from "../../interfaces/v2/RoomInterfaces";

export interface IRoomDataStorage {
  findById(id: number): Promise<IRoom>;
  findAll(): Promise<IRoom[]>;
  findByNameColor(name: string, color: string, id?: number): Promise<IRoom>;
  create(room: IRoomRequest): Promise<IRoom>;
  update(room: IUpdateRoom): Promise<IRoom>;
}
