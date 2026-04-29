import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const ownerHash = await bcrypt.hash("owner1234", 10);
  const cashierHash = await bcrypt.hash("cashier1234", 10);

  await db.user.upsert({
    where: { email: "owner@tedesetcafe.com" },
    update: {},
    create: {
      name: "Owner",
      email: "owner@tedesetcafe.com",
      passwordHash: ownerHash,
      role: "OWNER"
    }
  });

  await db.user.upsert({
    where: { email: "cashier@tedesetcafe.com" },
    update: {},
    create: {
      name: "Cashier",
      email: "cashier@tedesetcafe.com",
      passwordHash: cashierHash,
      role: "CASHIER"
    }
  });

  console.log("Seeded: owner@tedesetcafe.com (owner1234), cashier@tedesetcafe.com (cashier1234)");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
