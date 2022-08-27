import * as Joi from "@hapi/joi";
//@ts-ignore
import ObjectId from "joi-objectid";

export const matchGroupSchema = Joi.object({
  name: Joi.string().required(),
  teams: Joi.array().required(),
});

export const matchGroupIdSchema = Joi.object({
  id: ObjectId(Joi)().required(),
  matchGroupId: ObjectId(Joi)().required(),
});
