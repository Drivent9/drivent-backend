import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createActivity,
  createActivityBooking,
  createActivityPlace,
  createEnrollmentWithAddress,
  createEvent,
  createUser,
  createTicket,
  createTicketTypeWithHotel,
  createHotel,
  createRoomWithHotelId,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /activities', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/activities');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 403 if user has not paymented ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const response = await server.post('/activities').set('Authorization', `Bearer ${token}`).send({
        roomId: room.id,
      });

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });
    it('should respond with status 404 if no activities are found', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and enrollment data with address when there is a enrollment for given user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
    });
  });
});

function createValidBody(id: number) {
  return {
    activityId: id,
  };
}

describe('POST /activities/booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const validBody = createValidBody(1);
    const response = await server.post('/activities/booking').send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const validBody = createValidBody(1);

    const response = await server.post('/activities/booking').set('Authorization', `Bearer ${token}`).send(validBody);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const validBody = createValidBody(1);

    const response = await server.post('/activities/booking').set('Authorization', `Bearer ${token}`).send(validBody);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 403 if user has not paid ticket', async () => {
      const event = await createEvent();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createHotel();

      const activityPlace = await createActivityPlace();
      const activity = await createActivity(activityPlace.id, event.id, event.startsAt, event.endsAt);
      const validBody = createValidBody(activity.id);

      const response = await server.post('/activities/booking').set('Authorization', `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 if activity does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();

      await createActivityPlace();
      const validBody = createValidBody(1);

      const response = await server.post('/activities/booking').set('Authorization', `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 409 if user is signed in at another activity at the same time', async () => {
      const event = await createEvent();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();

      const activityPlace = await createActivityPlace();
      const activity1 = await createActivity(activityPlace.id, event.id, event.startsAt, event.endsAt);
      await createActivityBooking(activity1.id, user.id);

      const activity2 = await createActivity(activityPlace.id, event.id, event.startsAt, event.endsAt);
      const validBody = createValidBody(activity2.id);
      const response = await server.post('/activities/booking').set('Authorization', `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.CONFLICT);
    });

    it('should respond with status 201 and activity booking id', async () => {
      const event = await createEvent();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();

      const activityPlace = await createActivityPlace();
      const activity = await createActivity(activityPlace.id, event.id, event.startsAt, event.endsAt);
      const validBody = createValidBody(activity.id);

      const response = await server.post('/activities/booking').set('Authorization', `Bearer ${token}`).send(validBody);

      expect(response.status).toEqual(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
      });
    });
  });
});
