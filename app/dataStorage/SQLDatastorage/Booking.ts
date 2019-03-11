import * as fp from "lodash/fp";

import { parseQueryFactory } from "./query";
import { Booking } from "./../../models/Booking";
import { Attendee } from "./../../models/Attendee";
import { BookingAttendee } from "./../../models/BookingAttendee";
import { IBooking, IQuery } from "./interfaces";

const formatBookings = (bookings: IBooking[]) => {
  const parsedBookings: IBooking[] = bookings.map((booking: any) => {
    if (booking["user"]) {
      const bookingObj = booking.toJSON();
      // This is necessary for remove values for user: password, role
      return { ...fp.omit("user", bookingObj), user: booking.user.toJSON() };
    }

    return booking.toJSON();
  });

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
  const findAll = async (query: IQuery) => {
    try {
      // by default return this association
      const baseInclude = [
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
      ];

<<<<<<< Updated upstream
      const { limit, offset, order, include } = parseQueryFactory(query);
      // total records it's useful for pagination
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
      const rowPromise = model.count();
      /*
        TODO: 
          - Define base where (if it's necessary) and add extra include 
          see parseQueryFactory
      */
=======
      const { limit, offset, order, include, where } = parseQueryFactory(query);
      // total records it's useful for pagination
      const rowPromise = model.count();

>>>>>>> Stashed changes
      const bookingsPromise = model.findAll({
        include: [...baseInclude, ...include],
        limit,
        offset,
        order,
        where
      });

      const [bookings, rows]: [any, number] = await Promise.all([
        bookingsPromise,
        rowPromise
      ]);

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
