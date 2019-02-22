import * as Joi from "joi";

const RoomSchema = () => {
  const name = Joi.string().required();
  const color = Joi.string().required();
  const id = Joi.number().required();

  return {
    createRoom: Joi.object().keys({
      body: {
        name,
        color
      }
    }),

    updateRoom: Joi.object().keys({
      body: {
        name,
        color
      }
    }),

    deleteRoom: Joi.object().keys({
      params: {
        id
      }
    }),

    getRoom: Joi.object().keys({
      params: {
        id
      }
    }),

    getAvailableHours: Joi.object().keys({
      params: {
        id
      }
    }),

    hours: Joi.object().keys({
      query: {
        fromDate: Joi.date()
          .iso()
          .required(),
        toDate: Joi.date()
          .iso()
          .required()
      },

      params: {
        id
      }
    })
  };
};

const roomSchema = RoomSchema();
export { roomSchema };
