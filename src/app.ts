require("dotenv").config();
import express, { Response } from "express";
import { PrismaClient } from "@prisma/client";
const bodyParser = require("body-parser");

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

async function bootstrap() {
  //Add User
  app.post("/api/user", async (req: any, res: Response) => {
    const { email, name } = req.body;
    try {
      const user = await prisma.user.create({
        data: { email, name },
      });
      res.status(200).json({
        status: "success",
        user,
      });
    } catch (e) {
      res.status(400).json({
        status: "failed",
        message: e,
      });
    }
  });

  //Get User
  app.get("/api/user/:id", async (req, res: Response) => {
    try {
      const user = await prisma.user.findFirst({
        where: { id: parseInt(req.params.id) },
      });
      res.status(200).json({
        status: "success",
        user,
      });
    } catch (e) {
      res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
  });

  //Get User Expenses
  app.get("/api/user/:id/expenses", async (req, res: Response) => {
    try {
      const requestUserId = parseInt(req.params.id);
      const memberGroups = await prisma.groupMembership.findMany({
        where: { userId: requestUserId },
        include: { group: { include: { expenses: true, members: true } } },
      });

      let expenses = [];

      memberGroups.forEach((mG) => {
        mG.group.expenses.forEach((e) => {
          let expense: any = {
            date:
              new Date(e.createdAt).getDate() +
              "/" +
              new Date(e.createdAt).getMonth(),
            group: mG.group.name,
            description: e.title,
            totalAmount: e.amount,
          };

          const numOfGroupMembers = mG.group.members.length;

          if (e.splitType === "EQUAL") {
            const perUserExpense = e.amount / numOfGroupMembers;
            expense.pendingAmount =
              requestUserId === e.payeeId
                ? (numOfGroupMembers - 1) * perUserExpense
                : -perUserExpense;
          } else if (e.splitType === "EXACT") {
            const currentUserSplit = e.splits[requestUserId];
            expense.pendingAmount =
              requestUserId === e.payeeId
                ? e.amount - currentUserSplit
                : -currentUserSplit;
          } else {
            const currentUserSplit = (e.splits[requestUserId] * e.amount) / 100;
            expense.pendingAmount =
              requestUserId === e.payeeId
                ? e.amount - currentUserSplit
                : -currentUserSplit;
          }
          expenses.push(expense);
        });
      });

      res.status(200).json({
        status: "success",
        expenses,
      });
    } catch (e) {
      res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
  });
  //Create Group
  app.post("/api/group", async (req, res: Response) => {
    const { name, ownerId = 1 } = req.body;

    try {
      const group = await prisma.group.create({
        data: { ownerId, name },
      });

      await prisma.groupMembership.create({
        data: { userId: ownerId, groupId: group.id },
      });

      res.status(200).json({
        status: "success",
        group,
      });
    } catch (e) {
      res.status(400).json({
        status: "failed",
        message: e,
      });
    }
  });

  //Get Group
  app.get("/api/group/:id", async (req, res: Response) => {
    try {
      const group = await prisma.group.findFirst({
        where: { id: parseInt(req.params.id) },
        include: {
          members: { include: { user: true } },
          owner: true,
        },
      });

      res.status(200).json({
        status: "success",
        group,
      });
    } catch (e) {
      res.status(404).json({
        status: "failed",
        message: "Group not found",
      });
    }
  });

  //Get Group Expenses
  app.get("/api/group/:id/expenses", async (req, res: Response) => {
    try {
      const expenses = await prisma.expenses.findMany({
        where: { groupId: parseInt(req.params.id) },
      });

      res.status(200).json({
        status: "success",
        expenses,
      });
    } catch (e) {
      res.status(404).json({
        status: "failed",
        message: "Group not found",
      });
    }
  });
  //Add Member
  app.post("/api/group/:id/add-member", async (req, res: Response) => {
    try {
      const group = await prisma.group.findFirst({
        where: { id: parseInt(req.params.id) },
      });
      if (!group) {
        throw "Not Found";
      }

      await prisma.groupMembership.create({
        data: { userId: req.body.userId, groupId: group.id },
      });

      res.status(200).json({
        status: "success",
        group,
      });
    } catch (e) {
      res.status(404).json({
        status: "failed",
        message: "Group not found",
      });
    }
  });

  //Add Expense
  app.post("/api/group/:id/add-expense", async (req, res: Response) => {
    try {
      const group = await prisma.group.findFirst({
        where: { id: parseInt(req.params.id) },
      });
      if (!group) {
        throw "Not Found";
      }
      const { groupId, payeeId, amount, title, splits, splitType } = req.body;

      await prisma.expenses.create({
        data: { groupId, payeeId, amount, title, splits, splitType },
      });

      res.status(200).json({
        status: "success",
        group,
      });
    } catch (e) {
      res.status(404).json({
        status: "failed",
        message: "Group not found",
      });
    }
  });

  app.get("/", async (_, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "Hello World!",
    });
  });

  app.listen("8080", () => {
    console.log(`Server on port: 8080`);
  });
}

bootstrap()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
