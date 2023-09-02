import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      name: "Alice",
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      name: "Bob",
    },
  });
  const charles = await prisma.user.upsert({
    where: { email: "charles@example.com" },
    update: {},
    create: {
      email: "charles@example.com",
      name: "Charles",
    },
  });

  const daniel = await prisma.user.upsert({
    where: { email: "daniel@example.com" },
    update: {},
    create: {
      email: "daniel@example.com",
      name: "Daniel",
    },
  });

  const group = await prisma.group.create({
    data: { ownerId: 1, name: "Office" },
  });

  await prisma.groupMembership.create({
    data: { userId: 1, groupId: group.id },
  });

  await prisma.groupMembership.create({
    data: { userId: 2, groupId: group.id },
  });

  await prisma.groupMembership.create({
    data: { userId: 3, groupId: group.id },
  });

  await prisma.groupMembership.create({
    data: { userId: 4, groupId: group.id },
  });

  await prisma.expenses.create({
    data: {
      title: "Expense Equal Split",
      payeeId: 1,
      amount: 100,
      splitType: "EQUAL",
      groupId: 1,
    },
  });
  await prisma.expenses.create({
    data: {
      title: "Expense Percentage Split",
      payeeId: 2,
      amount: 1500,
      splitType: "PERCENTAGE",
      groupId: 1,
      splits: { 1: 20, 2: 30, 3: 10, 4: 40 },
    },
  });

  await prisma.expenses.create({
    data: {
      title: "Expense Exact Split",
      payeeId: 3,
      amount: 100,
      splitType: "EXACT",
      groupId: 1,
      splits: { 1: 20, 2: 30, 3: 10, 4: 40 },
    },
  });

  console.log({ alice, bob });
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
