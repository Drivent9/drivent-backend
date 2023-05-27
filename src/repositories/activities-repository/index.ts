import { Activity, ActivityBooking } from '.prisma/client';
import { prisma } from '@/config';

async function createActivityBooking(activityId: number, userId: number): Promise<ActivityBooking> {
  return prisma.activityBooking.create({
    data: {
      activityId,
      userId,
    },
  });
}

async function findActivities() {
  return prisma.activity.findMany();
}

async function findActivityById(activityId: number): Promise<Activity> {
  return prisma.activity.findUnique({
    where: {
      id: activityId,
    },
  });
}

async function findAllActivityBookings(userId: number): Promise<ActivityBooking[]> {
  return prisma.activityBooking.findMany({
    where: {
      userId: userId,
    },
  });
}

const activitiesRepository = {
  createActivityBooking,
  findActivities,
  findActivityById,
  findAllActivityBookings,
};

export default activitiesRepository;
