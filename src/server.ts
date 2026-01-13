import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const port = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log('--- Database Connected Successfully ---');
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();