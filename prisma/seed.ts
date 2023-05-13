import { PrismaClient, Hotel } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (event) await prisma.event.deleteMany({});

  const event1 = await prisma.event.create({
    data: {
      title: 'Driven.t',
      logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
      backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
      startsAt: dayjs().toDate(),
      endsAt: dayjs().add(21, 'days').toDate(),
    },
  });

  let TicketType = await prisma.ticketType.findFirst();
  if (TicketType) await prisma.ticketType.deleteMany({});

  const TicketType1 = await prisma.ticketType.create({
    data: {
      name: 'Online',
      price: 100,
      isRemote: true,
      includesHotel: false,
      createdAt: dayjs().toDate(),
    },
  });

  const TicketType2 = await prisma.ticketType.create({
    data: {
      name: 'Presencial',
      price: 250,
      isRemote: false,
      includesHotel: false,
      createdAt: dayjs().toDate(),
    },
  });

  const TicketType3 = await prisma.ticketType.create({
    data: {
      name: 'Presencial',
      price: 600,
      isRemote: false,
      includesHotel: true,
      createdAt: dayjs().toDate(),
    },
  });

  let Hotel = await prisma.hotel.findMany();
  if (Hotel.length > 0) await prisma.hotel.deleteMany({});

  let hotels: Hotel[] = [];

  const hotelData = [
    {
      name: 'Hotel 1',
      image: 'https://pix10.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?ca=6&ce=1&s=1024x768',
    },
    {
      name: 'Hotel 2',
      image:
        'https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/08/29/1013/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.jpg/Grand-Hyatt-Rio-de-Janeiro-P443-Pool.16x9.jpg?imwidth=1920',
    },
    {
      name: 'Hotel 3',
      image: 'https://www.hotelbellaitalia.com.br/wp-content/uploads/2022/10/Fachada-teste.png',
    },
  ];

  for (let data of hotelData) {
    const hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        image: data.image,
        createdAt: dayjs().toDate(),
      },
    });

    hotels.push(hotel);
  }

  for (let hotel of hotels) {
    const roomCount = Math.floor(Math.random() * 17) + 4;
    for (let i = 1; i <= roomCount; i++) {
      await prisma.room.create({
        data: {
          name: `Room ${i}`,
          capacity: Math.floor(Math.random() * 3) + 1,
          hotelId: hotel.id,
          createdAt: dayjs().toDate(),
        },
      });
    }
  }

  console.log(`Ticket types e evento criado`, event1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
