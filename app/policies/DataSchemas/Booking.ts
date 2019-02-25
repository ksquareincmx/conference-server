import * as Joi from "joi";

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

    getBookings: {
      param: {
        id
      }
    },

    getAllBookings: {
      query: {
        fromDate: Joi.date().iso(),
        toDate: Joi.date().iso()
      }
    }
  };
};

const bookingSchema = BookingSchema();

export { bookingSchema };
