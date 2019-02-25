import * as Joi from "joi";

const RoomSchema = () => {
  const name = Joi.string().required();
  const color = Joi.string().required();
  const id = Joi.number().required();

  return {
    createRoom: {
      body: {
        name,
        color
      }
    },

    updateRoom: {
      body: {
        name,
        color
      }
    },

    deleteRoom: {
      params: {
        id
      }
    },

    getRoom: {
      params: {
        id
      }
    },

    getAvailableHours: {
      params: {
        id
      }
    },

    hours: {
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
    }
  };
};

const roomSchema = RoomSchema();
export { roomSchema };
