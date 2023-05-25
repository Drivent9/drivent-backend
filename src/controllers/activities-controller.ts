import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import activityService from '@/services/activities-service';

export async function getActivities(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
  try {
    const activityList = await activityService.getActivities();
    return res.status(httpStatus.OK).send(activityList);
  } catch (e) {
    next(e);
  }
}

export async function createActivity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
  try {
    const activity = await activityService.createActivity();
    return res.status(httpStatus.CREATED).send(activity);
  } catch (e) {
    next(e);
  }
}

export async function createPlace(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
  try {
    const place = await activityService.createPlace();
    return res.status(httpStatus.CREATED).send(place);
  } catch (e) {
    next(e);
  }
}

export async function bookActivity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response> {
  try {
    const booking = await activityService.bookActivity();
    return res.status(httpStatus.CREATED).send(booking);
  } catch (e) {
    next(e);
  }
}
