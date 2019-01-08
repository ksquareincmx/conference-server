import { IRoomResponse } from "./../interfaces/RoomInterfaces";
import { toSyntax } from "./../libraries/util";

import * as fp from "lodash/fp";

export const roomMapper = {
  toEntity: roomJSON => toSyntax(roomJSON, fp.camelCase),
  toDTO: (roomEntity): IRoomResponse =>
    <IRoomResponse>toSyntax(roomEntity, fp.snakeCase)
};
