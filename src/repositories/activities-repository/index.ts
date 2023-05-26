import { prisma } from '@/config';

async function findActivities() {
  return prisma.activity.findMany();
}

const activitiesRepository = {
  findActivities,
};

export default activitiesRepository;
