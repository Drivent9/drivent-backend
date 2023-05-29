import { Activity, ActivityBooking } from '.prisma/client';
import { conflictError, notFoundError } from '@/errors';
import { cannotListActivitiesError } from '@/errors/cannot-list-activities-error';
import activitiesRepository from '@/repositories/activities-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getActivities(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListActivitiesError();
  }

  const activities = await activitiesRepository.findActivities();
  if (!activities || activities.length === 0) {
    throw notFoundError();
  }
  return activities;
}

async function bookActivity(activityId: number, userId: number) {
  
  const activityToRegister: Activity = await activitiesRepository.findActivityById(activityId);
  if (!activityToRegister) throw notFoundError();

  const userActivities: ActivityBooking[] = await activitiesRepository.findAllActivityBookings(userId);
  for (let i = 0; i < userActivities.length; i++) {
    const activity: Activity = await activitiesRepository.findActivityById(userActivities[i].id);
    if (activity.startsAt === activityToRegister.startsAt)
      throw conflictError('User cannot participate on two events at the same time!');
  }

  const activityBooking: ActivityBooking = await activitiesRepository.createActivityBooking(activityId, userId);
  return activityBooking;
}

async function createActivity() {
  return 0;
}

async function createPlace() {
  return 0;
}

const activityService = { bookActivity, createActivity, createPlace, getActivities };

export default activityService;
