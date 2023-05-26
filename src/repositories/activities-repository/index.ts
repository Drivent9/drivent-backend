import { prisma } from '@/config';

async function findActivities() {
  return prisma.activity.findMany({
    include: {
      ActivityPlace: true,
    },
  });
}

const activitiesRepository = {
  findActivities,
};

export default activitiesRepository;
