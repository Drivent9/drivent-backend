import { notFoundError } from '@/errors';
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

async function bookActivity() {
  return 0;
}

async function createActivity() {
  return 0;
}

async function createPlace() {
  return 0;
}

const activityService = { bookActivity, createActivity, createPlace, getActivities };

export default activityService;
