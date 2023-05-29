import eventRepository from "@/repositories/event-repository";
import { getEvent } from "../factories";
import eventsService from "@/services/events-service";


describe('get Event', () => {
  it('Should return event data', async () => {
    const event = getEvent();

    jest.spyOn(eventRepository, 'findFirst').mockResolvedValue(event);


    const result = await eventsService.getFirstEvent();

    expect(result).toEqual(result);
  });
});
