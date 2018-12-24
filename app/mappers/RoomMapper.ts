import { IRoomResponse } from "./../interfaces/RoomInterfaces";
import * as fp from "lodash/fp";
import { toSyntax } from "./../libraries/util";

export const bookingMapper = {
  toEntity: roomJSON => toSyntax(roomJSON, fp.camelCase),

  toJSON: (roomEntity): IRoomResponse =>
    <IRoomResponse>toSyntax(roomEntity, fp.snakeCase)
};
