import dotenv from "dotenv";

dotenv.config();

const prismaConfig = {
  schema: "prisma/schema",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
};

export default prismaConfig;