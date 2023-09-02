## Steps to run the project

### Prerequisite

Docker, Node.js, Yarn

1. Run `docker-compose up -d` to start the database
2. Run `yarn install` to install the dependencies
3. Run `yarn push` to create the database and tables
4. Run `npx prisma db seed` to pre-populate the data
5. Run `yarn start` to start the server

### API Endpoints

To call the APIS Postman or Thunder Client can be used

#### API Endpoints

GET: /api/user/:id - Get the User with the `id`

POST: /api/user - Create a new user
Example JSON Body {name:'Alice', email:'alice@example.com'}

GET: /api/group/:id - Get the Group with the `id`

POST: /api/group - Create a new group
Example JSON Body {name:'Group 1', ownerId:1}

POST: /api/group/:id/add-member - Get the Group with the `id`
Example JSON Body {userId:2}

GET: /api/user/:id/expenses - Get user expenses

POST: /api/group/:id/add-expense - Add Expense to a group
Example Example JSON Body {
title: "Expense Equal Split",
payeeId: 1,
amount: 100,
splitType: "EQUAL",
groupId: 1,
}
