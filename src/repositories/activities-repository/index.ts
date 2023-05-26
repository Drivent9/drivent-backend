import { prisma } from '@/config';

async function findActivities() {
  return prisma.activity.findMany({
    include: {
      ActivityPlace: true,
      ActivityBooking: true,
    },
  });
}

const activitiesRepository = {
  findActivities,
};

export default activitiesRepository;
