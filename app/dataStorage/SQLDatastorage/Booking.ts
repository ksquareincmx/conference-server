import * as fp from "lodash/fp";

import { parseQueryFactory } from "./query";
import { Booking } from "./../../models/Booking";
import { Attendee } from "./../../models/Attendee";
import { BookingAttendee } from "./../../models/BookingAttendee";
import { IBooking, IQuery } from "./interfaces";

const formatBookings = (bookings: IBooking[]) => {
  const parsedBookings: IBooking[] = bookings.map((booking: any) =>
    booking.toJSON()
  );

  const formattedBookings = parsedBookings.map((booking: IBooking) => {
    const attendees: string[] = booking.bookingAttendee.reduce(
      (acc: string[], bookingAtt) => [...acc, bookingAtt.attendee.email],
      []
    );

    return {
      ...fp.omit("bookingAttendee", booking),
      attendees
    };
  });

  return formattedBookings;
};

function BookingDataStorage(model = Booking) {
  //
  const findAll = async (query: IQuery) => {
    try {
      const { limit, offset, order } = parseQueryFactory(query);

      const rowPromise = model.count();
      /*
        TODO: 
          - Define base include (it's necessary) and add extra include
          - Define base where (if it's necessary) and add extra include 
          see parseQueryFactory
      */
      const bookingsPromise = model.findAll({
        include: [
          {
            attributes: ["id"],
            model: BookingAttendee,
            required: true,
            include: [
              {
                attributes: ["email"],
                model: Attendee,
                required: false
              }
            ]
          }
        ],
        limit,
        offset,
        order
      });

      const [bookings, rows]: [any, number] = await Promise.all([
        bookingsPromise,
        rowPromise
      ]);
      console.log(rows);
      return { rows, bookings: formatBookings(bookings) };
    } catch (error) {
      throw new Error(error);
    }
  };

  return {
    findAll
  };
}

const bookingDataStorage = BookingDataStorage();
export { bookingDataStorage };
