import { User } from "./../../models/User";
import { Op } from "sequelize";
import * as fp from "lodash/fp";

import { parseQueryFactory } from "./query";
import { Room } from "./../../models/Room";
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
        },
        {
          model: Room,
          require: true
        },
        {
          model: User,
          required: true
        }
      ];

      const { limit, offset, order, include, where } = parseQueryFactory(query);
      // total records it's useful for pagination
      const rowPromise = model.count();

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

  const create = async (booking: IBooking) => {};

  // checks if booking exist in determinate intervalue time
  const findCollisions = async ({ start, end, roomId }) => {
    try {
      const booking: Booking = await Booking.find({
        where: {
          [Op.and]: {
            [Op.not]: {
              [Op.or]: {
                end: {
                  [Op.lte]: start
                },
                start: {
                  [Op.gte]: end
                }
              }
            },
            roomId: {
              [Op.eq]: roomId
            }
          }
        }
      });

      return booking;
    } catch (error) {}
  };

  const findUpdatedCollisions = async ({ start, end, roomId, id }) => {
    try {
      const booking: Booking = await Booking.find({
        where: {
          [Op.and]: {
            [Op.not]: {
              [Op.or]: {
                end: {
                  [Op.lte]: start
                },
                start: {
                  [Op.gte]: end
                }
              }
            },
            roomId: {
              [Op.eq]: roomId
            },
            id: {
              [Op.ne]: id
            }
          }
        }
      });
      return booking;
    } catch (error) {}
  };

  return {
    findAll,
    create,
    findCollisions,
    findUpdatedCollisions
  };
}

const bookingDataStorage = BookingDataStorage();
export { bookingDataStorage };
