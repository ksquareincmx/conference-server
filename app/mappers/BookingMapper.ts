import { IBookingResponse } from "./../interfaces/BookingInterfaces";
import { toSyntax } from "./../libraries/util";

import * as fp from "lodash/fp";

export const bookingMapper = {
  toEntity: bookingJSON => toSyntax(bookingJSON, fp.camelCase),
  toJSON: (bookingEntity): IBookingResponse =>
    <IBookingResponse>toSyntax(bookingEntity, fp.snakeCase)
};
