import * as Joi from "joi";

// TODO: add include, where filters
const pageSize = Joi.number()
  .positive()
  .optional();
const page = Joi.number()
  .positive()
  .optional();
const order = Joi.string().optional();

export { page, pageSize, order };
