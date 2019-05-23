import {
  IUpdateBookingRequest,
  IUpdateBookingDTO,
  IBookingResponse,
  IBookingRequest,
  IBookingDTO
} from "./../../interfaces/v2/BookingInterfaces";
import { toSyntax } from "./../../libraries/util";

import * as fp from "lodash/fp";
import * as moment from "moment";

// TODO: add interface for arg toDTO
export const bookingMapper = {
  toEntity: bookingDao => toSyntax(bookingDao, fp.camelCase),
  toDTO: (bookingEntity): IBookingResponse => {
    return {
      id: bookingEntity.id,
      description: bookingEntity.description,
      start: bookingEntity.start,
      end: bookingEntity.end,
      user_id: bookingEntity.userId,
      room_id: bookingEntity.roomId,
      event_id: bookingEntity.eventId,
      updated_at: bookingEntity.updatedAt,
      created_at: bookingEntity.createdAt,
      attendees: bookingEntity.attendees,
      room: {
        id: bookingEntity.room.id,
        name: bookingEntity.room.name,
        txt_color: bookingEntity.room.txtColor,
        bg_color: bookingEntity.room.bgColor,
        presence: bookingEntity.room.presence,
        created_at: bookingEntity.room.createdAt,
        updated_at: bookingEntity.room.updatedAt
      },
      user: {
        id: bookingEntity.user.id,
        auth_provider_id: bookingEntity.user.authProviderId,
        picture: bookingEntity.user.picture,
        name: bookingEntity.user.name,
        email: bookingEntity.user.email
      }
    };
  }
};

// TODO: create a interface with params optional and reduce to one mapper
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
