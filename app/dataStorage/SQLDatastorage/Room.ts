import { Op } from "sequelize";
import { Room } from "./../../models/Room";
import {
  IRoom,
  IRoomRequest,
  IUpdateRoom
} from "./../../interfaces/RoomInterfaces";
import { IRoomDataStorage } from "./../interfaces/RoomDataStorage";

export function RoomDataStorage(): IRoomDataStorage {
  const findById = async (id: number): Promise<IRoom> => {
    try {
      const room = await Room.findById(id);
      return room.toJSON();
    } catch (error) {
      throw error;
    }
  };

  const findAll = async (): Promise<IRoom[]> => {
    try {
      const rooms = await Room.findAll();
      return rooms.map(room => room.toJSON());
    } catch (error) {
      throw error;
    }
  };

  const findByNameColor = async (
    name: string,
    color: string,
    id?: number
  ): Promise<IRoom> => {
    try {
      if (id !== undefined) {
        const room = await Room.findOne({
          where: {
            [Op.or]: { name, color }
          }
        });
        return room.toJSON();
      }

      const room = await this.model.findOne({
        where: {
          [Op.or]: { name, color },
          id: { [Op.ne]: id }
        }
      });

      return room.toJSON();
    } catch (error) {
      throw error;
    }
  };

  const create = async (room: IRoomRequest): Promise<IRoom> => {
    try {
      const roomCreated = await Room.create(room);
      return roomCreated.toJSON();
    } catch (error) {}
  };

  const update = async (room: IUpdateRoom): Promise<IRoom> => {
    try {
      const roomToUpdate = await Room.findById(room.id);
      const roomUpdated = await roomToUpdate.update(roomToUpdate);
      return roomUpdated.toJSON();
    } catch (error) {}
  };

  return {
    findById,
    findAll,
    findByNameColor,
    create,
    update
  };
}
