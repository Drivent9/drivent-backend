import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  let TicketType = await prisma.ticketType.findFirst();
  if (!TicketType) {
    const TicketType1 = await prisma.ticketType.create({
      data: {
        name: "Remoto",
        price: 250,
        isRemote: true,
        includesHotel: false,
        createdAt: dayjs().toDate(),
      },
    });

    const TicketType2 = await prisma.ticketType.create({
      data: {
        name: "Presencial",
        price: 800,
        isRemote: false,
        includesHotel: false,
        createdAt: dayjs().toDate(),
      },
    });
    
    const TicketType3 = await prisma.ticketType.create({
      data: {
        name: "Presencial",
        price: 1300,
        isRemote: false,
        includesHotel: true,
        createdAt: dayjs().toDate(),
      },
    });
  }

  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
