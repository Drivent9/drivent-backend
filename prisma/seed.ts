import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (event) await prisma.event.deleteMany({}); 

  const event1 = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  

  let TicketType = await prisma.ticketType.findFirst();
  if (TicketType) await prisma.ticketType.deleteMany({});
  
    const TicketType1 = await prisma.ticketType.create({
      data: {
        name: "Online",
        price: 100,
        isRemote: true,
        includesHotel: false,
        createdAt: dayjs().toDate(),
      },
    });

    const TicketType2 = await prisma.ticketType.create({
      data: {
        name: "Presencial",
        price: 250,
        isRemote: false,
        includesHotel: false,
        createdAt: dayjs().toDate(),
      },
    });

    const TicketType3 = await prisma.ticketType.create({
      data: {
        name: "Presencial",
        price: 600,
        isRemote: false,
        includesHotel: true,
        createdAt: dayjs().toDate(),
      },
    });
  

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
