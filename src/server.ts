import app from "./app";
import prisma from "./app/shared/prisma";

const port = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("--- Database Connected Successfully (CareOrbit) ---");
    app.listen(port, () => {
      console.log(`🚀 Server is running on: http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main();
