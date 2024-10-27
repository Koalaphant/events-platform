// seed.ts

import { seedEventsFromTicketmaster } from "./seedFunctions";
import db from "@/db/db";

async function main() {
  try {
    await seedEventsFromTicketmaster();
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await db.$disconnect(); // Ensure to disconnect the database
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
