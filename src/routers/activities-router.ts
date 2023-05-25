import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getActivities, createActivity, createPlace, bookActivity } from '@/controllers';
import { activitySchema, activityBookingSchema } from '@/schemas/activities-schemas';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/', getActivities)
  .post('/', validateBody(activitySchema), createActivity)
  .post('/place', validateBody(activitySchema), createPlace)
  .post('/booking', validateBody(activityBookingSchema), bookActivity);

export { activitiesRouter };
