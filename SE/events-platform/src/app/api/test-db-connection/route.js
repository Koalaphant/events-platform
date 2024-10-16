// app/api/test-db-connection/route.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");
    return new Response(
      JSON.stringify({ message: "Database connected successfully." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Database connection failed: ", error);
    return new Response(
      JSON.stringify({
        error: "Database connection failed.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}
