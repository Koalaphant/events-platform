import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

const prisma = new PrismaClient();

dotenv.config({
  path: path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "../.env.local"
  ),
});

// Function to test database connection
async function testConnection() {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    throw new Error("Not in development mode.");
  }

  try {
    await prisma.event.deleteMany({});
    await prisma.$connect();
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Database disconnected.");
  }
}

// Call the test connection function
testConnection();
