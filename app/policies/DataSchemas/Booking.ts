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
  const attendees = Joi.array()
    .items(
      Joi.string()
        .email()
        .required()
    )
    .required();

  const userId = Joi.number().required();
  const id = Joi.number().required();

  return {
    createBooking: Joi.object().keys({
      body: {
        start,
        end,
        description,
        room_id,
        attendees,
        userId
      }
    }),

    updateBooking: Joi.object().keys({
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
    }),

    getBookings: Joi.object().keys({
      param: {
        id
      }
    }),

    getAllBookings: Joi.object().keys({
      query: {
        fromDate: Joi.date().iso(),
        toDate: Joi.date().iso()
      }
    })
  };
};

export { BookingSchema };
