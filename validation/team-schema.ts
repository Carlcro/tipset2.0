import * as Joi from "@hapi/joi";
import ObjectId from "joi-objectid";

export const teamSchema = Joi.object({
  name: Joi.string().required(),
  group: Joi.string(),
});

export const teamIdSchema = Joi.object({
  id: ObjectId(Joi)().required(),
});
