import {
  IUpdateBookingRequest,
  IUpdateBookingDTO,
  IBookingResponse,
  IBookingRequest,
  IBookingDTO
} from "./../../interfaces/v1/BookingInterfaces";
import { toSyntax } from "./../../libraries/util";

import * as fp from "lodash/fp";
import * as moment from "moment";

export const bookingMapper = {
  toEntity: bookingJSON => toSyntax(bookingJSON, fp.camelCase),
  toDTO: (bookingEntity): IBookingResponse =>
    <IBookingResponse>toSyntax(bookingEntity, fp.snakeCase)
};

export const createBookingMapper = {
  toEntity: (dto: IBookingDTO): IBookingRequest => ({
    start: moment(dto.start)
      .utc()
      .format(),
    end: moment(dto.end)
      .utc()
      .format(),
    description: dto.description,
    roomId: dto.room_id,
    userId: dto.userId,
    attendees: dto.attendees
  })
};

export const updateBookingMapper = {
  toEntity: (dto: IUpdateBookingDTO): IUpdateBookingRequest => ({
    params: {
      id: dto.params.id
    },
    body: {
      start: moment(dto.body.start)
        .utc()
        .format(),
      end: moment(dto.body.end)
        .utc()
        .format(),
      description: dto.body.description,
      roomId: dto.body.room_id,
      userId: dto.body.userId,
      attendees: dto.body.attendees
    }
  })
};
