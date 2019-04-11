import * as Joi from "joi";

import { page, pageSize, order } from "./query";

const BookingSchema = () => {
  const start = Joi.date()
    .iso()
    .min("now")
    .required();
  const end = Joi.date()
    .iso()
    .greater(Joi.ref("start"))
    .required();
  const description = Joi.string().required();
  const room_id = Joi.number().required();
  const attendees = Joi.alternatives()
    .try(
      Joi.array()
        .items(
          Joi.string()
            .email()
            .required()
        )
        .required(),
      Joi.array().length(0)
    )
    .required();

  const userId = Joi.number().required();
  const id = Joi.number().required();

  return {
    createBooking: {
      body: {
        start,
        end,
        description,
        room_id,
        attendees,
        userId
      }
    },

    updateBooking: {
      body: {
        start,
        end,
        description,
        room_id,
        attendees,
        userId
      },
      params: {
        id
      }
    },

    getBooking: {
      param: {
        id
      }
    },

    getBookings: {
      query: {
        page,
        pageSize,
        order,
        start: Joi.alternatives()
          .try(
            Joi.object().keys({
              lte: Joi.date()
                .iso()
                .optional()
            }),
            Joi.object().keys({
              gte: Joi.date()
                .iso()
                .optional()
            })
          )
          .optional(),

        end: Joi.alternatives()
          .try(
            Joi.object().keys({
              lte: Joi.date()
                .iso()
                .optional()
            }),
            Joi.object().keys({
              gte: Joi.date()
                .iso()
                .optional()
            })
          )
          .optional(),

        roomId: Joi.object()
          .keys({
            eq: Joi.number().required()
          })
          .optional()
      }
    },

    deleteBooking: {
      params: {
        id
      }
    }
  };
};

const bookingSchema = BookingSchema();

export { bookingSchema };
