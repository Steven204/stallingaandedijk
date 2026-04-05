import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.storagePhoto.deleteMany();
  await prisma.vehiclePlacement.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.storageLocation.deleteMany();
  await prisma.priceConfig.deleteMany();
  await prisma.seasonConfig.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      email: "admin@stallingaandedijk.nl",
      hashedPassword: adminPassword,
      name: "Beheerder",
      phone: "06 51 60 54 67",
      role: "ADMIN",
    },
  });

  // Create employee user
  const employeePassword = await hash("medewerker123", 12);
  const employee = await prisma.user.create({
    data: {
      email: "medewerker@stallingaandedijk.nl",
      hashedPassword: employeePassword,
      name: "Jan Medewerker",
      phone: "06 12345678",
      role: "EMPLOYEE",
    },
  });

  // Create sample customer
  const customerPassword = await hash("klant123", 12);
  const customer = await prisma.user.create({
    data: {
      email: "klant@voorbeeld.nl",
      hashedPassword: customerPassword,
      name: "Piet de Vries",
      phone: "06 98765432",
      address: "Voorbeeldstraat 1",
      city: "Utrecht",
      postalCode: "3500 AA",
      role: "CUSTOMER",
    },
  });

  // Create storage locations (sections A, B, C)
  const locations = [];
  for (const section of ["A", "B", "C"]) {
    for (let i = 1; i <= 10; i++) {
      const code = `${section}${i.toString().padStart(2, "0")}`;
      locations.push(
        await prisma.storageLocation.create({
          data: {
            code,
            label: `Plek ${code}`,
            section,
            isIndoor: section !== "C", // Section C is buitenterrein
            isOccupied: false,
          },
        })
      );
    }
  }

  // Create sample vehicle
  await prisma.vehicle.create({
    data: {
      customerId: customer.id,
      type: "CARAVAN",
      licensePlate: "AB-123-CD",
      brand: "Hobby",
      model: "De Luxe 490",
      lengthInMeters: 7.5,
      status: "STORED",
    },
  });

  // Create price configs
  const prices = [
    { vehicleType: "CARAVAN" as const, pricePerMeter: 55.0 },
    { vehicleType: "CAMPER" as const, pricePerMeter: 70.0 },
    { vehicleType: "BOAT" as const, pricePerMeter: 55.0 },
    { vehicleType: "OLDTIMER" as const, pricePerMeter: 70.0 },
    { vehicleType: "CAR" as const, pricePerMeter: 70.0 },
  ];

  for (const price of prices) {
    await prisma.priceConfig.create({ data: price });
  }

  // Create season config (winter period)
  await prisma.seasonConfig.create({
    data: {
      name: "Winterperiode",
      startMonth: 11,
      startDay: 15,
      endMonth: 3,
      endDay: 15,
      isClosedForPickup: true,
    },
  });

  console.log("Seed data created successfully!");
  console.log(`Admin: admin@stallingaandedijk.nl / admin123`);
  console.log(`Medewerker: medewerker@stallingaandedijk.nl / medewerker123`);
  console.log(`Klant: klant@voorbeeld.nl / klant123`);
  console.log(`${locations.length} stallingslocaties aangemaakt (A01-C10)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
