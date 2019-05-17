import {
  IRoomResponse,
  IRoomNew,
  IRoomSlackFormat
} from "../../interfaces/v2/RoomInterfaces";
import { toSyntax } from "./../../libraries/util";

import * as fp from "lodash/fp";

export const roomMapper = {
  toEntity: roomJSON => toSyntax(roomJSON, fp.camelCase),
  toDTO: (roomEntity): IRoomResponse =>
    <IRoomResponse>toSyntax(roomEntity, fp.snakeCase),
  toJSON: (room): IRoomNew => room.toJSON(),
  toSlackFormat: (rooms: IRoomNew[]): IRoomSlackFormat[] =>
    rooms.map(room => {
      const { id, name } = room;
      return { label: name, value: String(id) };
    })
};

// Crear una interfaz comun mapper
// Crear interfaz para el roomMapper y usar generics
