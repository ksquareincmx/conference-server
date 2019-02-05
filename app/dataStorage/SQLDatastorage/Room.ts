import { Op } from "sequelize";
import { Room } from "./../../models/Room";
import {
  IRoom,
  IRoomRequest,
  IUpdateRoom
} from "./../../interfaces/RoomInterfaces";
import { IRoomDataStorage } from "./../interfaces/RoomDataStorage";

function RoomDataStorage(): IRoomDataStorage {
  const findById = async (id: number): Promise<IRoom> => {
    try {
      const room = await Room.findById(id);

      if (room) {
        return room.toJSON();
      }
    } catch (error) {
      throw new Error("Error while finding a room");
    }
  };

  const findAll = async (): Promise<IRoom[]> => {
    try {
      const rooms = await Room.findAll();
      if (rooms) {
        return rooms.map(room => room.toJSON());
      }
    } catch (error) {
      throw new Error("Error while gets all rooms");
    }
  };

  const findByNameColor = async (
    name: string,
    color: string,
    id: number
  ): Promise<IRoom> => {
    try {
      if (id === undefined) {
        const room = await Room.findOne({
          where: {
            [Op.or]: { name: name, color: color }
          }
        });
        if (room) {
          return room.toJSON();
        }
      }

      if (id) {
        const room = await Room.findOne({
          where: {
            [Op.or]: { name, color },
            id: { [Op.ne]: id }
          }
        });

        if (room) {
          return room.toJSON();
        }
      }
    } catch (error) {
      throw new Error("Error while finding a room");
    }
  };

  const create = async (room: IRoomRequest): Promise<IRoom> => {
    try {
      const roomCreated = await Room.create(room);
      if (roomCreated) {
        return roomCreated.toJSON();
      }
    } catch (error) {
      throw new Error("Error while creating a room");
    }
  };

  const update = async (roomData: IUpdateRoom): Promise<IRoom> => {
    try {
      const room = await Room.findById(roomData.id);
      if (room) {
        const roomUpdated = await room.update(roomData);
        return roomUpdated.toJSON();
      }
    } catch (error) {
      throw new Error("Error while updating the room");
    }
  };

  return {
    findById,
    findAll,
    findByNameColor,
    create,
    update
  };
}

const roomDataStorage = RoomDataStorage();
export { roomDataStorage };
