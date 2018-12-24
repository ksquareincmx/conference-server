import { IBookingResponse } from "./../interfaces/BookingInterfaces";
import * as fp from "lodash/fp";
import { toSyntax } from "./../libraries/util";

export const bookingMapper = {
  toEntity: bookingJSON => toSyntax(bookingJSON, fp.camelCase),

  toJSON: (bookingEntity): IBookingResponse =>
    <IBookingResponse>toSyntax(bookingEntity, fp.snakeCase)
};
