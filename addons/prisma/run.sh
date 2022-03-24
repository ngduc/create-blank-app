#!/bin/bash
echo --- install Prisma to an existing Backend project.

# STEP 1 - install Prisma and init (generate .env and other files)
npm install prisma --save-dev
npm install @prisma/client

npx prisma init

# STEP 2 - add Schema Examples (User, Post tables)
echo 'add Schema Examples (User, Post tables) to ./prisma/schema.prisma'
cat >> ./prisma/schema.prisma <<EOL

model Post {
  id        String     @default(cuid()) @id
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  String?
}

model User {
  id            String       @default(cuid()) @id
  name          String?
  email         String?   @unique
  createdAt     DateTime  @default(now()) @map(name: "created_at")
  updatedAt     DateTime  @updatedAt @map(name: "updated_at")
  posts         Post[]
  @@map(name: "users")
}
EOL

npx prisma db push

# STEP 3 - add a route example /users: src/prismaRoutes.ts
FILE1="src/prismaRoutes.ts"
echo $FILE1
[ -f $FILE1 ] && echo \> file existed: overriding.
cat > $FILE1 <<EOL
import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// import this file and use it: app.use('/', prismaRoutes);
const router = express.Router();

router.get('/users', async (req, res) => {
  // example: create a new user:
  const newUser = await prisma.user.create({
    data: {
      name: 'New User ' + Math.random(),
      email: 'email-' + Math.random() + '@example.com'
    }
  });
  console.log('New user created: ', newUser);

  // example: find all users:
  const allUsers = await prisma.user.findMany({});
  console.log('All users: ', allUsers?.length);

  res.send(allUsers);
});

export default router;
EOL

# STEP 3 - verify - try it: open route /users
echo verify - edit [.env] file - try it: open route /users
