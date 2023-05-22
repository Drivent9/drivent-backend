import { Event } from '@prisma/client';
import { prisma, redis } from '@/config';

const cacheKey = 'event';
const cacheExpirationInSeconds = 60;

async function findFirst(): Promise<Event> {
  const cachedEvent = await redis.get(cacheKey);

  if (!cachedEvent) {
    const event = await prisma.event.findFirst();
    await redis.set(cacheKey, JSON.stringify(event));
    await redis.expire(cacheKey, cacheExpirationInSeconds);
    return event;
  }

  const event = JSON.parse(cachedEvent);
  return event;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
