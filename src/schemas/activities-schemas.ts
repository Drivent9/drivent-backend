import Joi from 'joi';
// import { SignInParams } from '@/services';
//É bom tipar o schema, eu não fiz isso ainda

export const activitySchema = Joi.object({
  title: Joi.string().required(),
  capacity: Joi.number().min(1).required(),
  activityPlaceId: Joi.number().min(1).required(),
  eventId: Joi.number().min(1).required(),
  startsAt: Joi.date().required(),
  endsAt: Joi.date().required(),
});

export const activityBookingSchema = Joi.object({
  activityId: Joi.number().min(1).required(),
  userId: Joi.number().min(1).required(),
});
