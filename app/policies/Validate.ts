import * as Joi from "joi";
import { Request, Response } from "express";

export function validate(schema: any) {
  return (req: Request, res: Response, next: Function) => {
    // method only validate for verbs: POST, PUT, GET
    const supportedMethods = new Set(["post", "put", "get"]);

    const validationOptions = {
      abortEarly: true // abort after the first validation error
    };

    const method = req.method.toLowerCase();

    if (!schema) {
      res.status(500).send("Internal Server Error.");
    }

    if (!supportedMethods.has(method)) {
      res.status(500).send("Internal Server Error.");
    }

    // add data to validate: req.body, req.params, req.query, etc
    const data = Object.keys(schema).reduce((acc, key) => {
      acc[key] = req[key];
      return acc;
    }, {});

    return Joi.validate(data, schema, validationOptions, (err, data) => {
      if (err) {
        const errorMessage = err.details[0].message.replace(/['"]/g, "");
        return res.status(400).json(`Bad Request: ${errorMessage}`);
      }
      next();
    });
  };
}
