import faker from '@faker-js/faker';
import { prisma } from '@/config';

export function createActivity(activityPlaceId: number, eventId: number, startDate: Date, endDate: Date) {
  return prisma.activity.create({
    data: {
      title: faker.name.findName(),
      capacity: 10,
      activityPlaceId: activityPlaceId,
      eventId: eventId,
      startsAt: startDate,
      endsAt: endDate,
    },
  });
}

export function createActivityBooking(activityId: number, userId: number) {
  return prisma.activityBooking.create({
    data: {
      activityId,
      userId,
    },
  });
}

export function createActivityPlace() {
  return prisma.activityPlace.create({
    data: {
      name: faker.name.findName(),
    },
  });
}
