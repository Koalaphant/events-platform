# SplendEvent 🎟️

SplendEvent is an events platform that allows users to create accounts, log in, and register for both paid and free events. Users can view a list of their orders directly on the platform and add events to their Google Calendar.

## View Live Version

- Customer url: [https://splendevent.vercel.app/](https://splendevent.vercel.app/)
- Admin url: [https://splendevent.vercel.app/admin](https://splendevent.vercel.app/admin)

## Test Accounts
### Admin Account
- Email: admin@test.com
- Password: admin1234

### User Account
- Email: user@test.com
- Password: user1234

## Features
### User:
- Display community events (paid and free)
- User account creation and login
- Register for free events and purchase paid events
- Add events to Google Calendar
- View a list of registered events in the user's account

### Admin:
- Create and display events
- View sales and customer data


## Technology Stack

- Next.js and TypeScript
- Clerk (Authentication)
- Database: PostgreSQL (With Prisma ORM)
- Hosting: Vercel (including file storage for images)
- Payments: Stripe API for ticket purchases

## Admin Panel

SplendEvent includes an admin panel that allows event management, toggling event availability, viewing sales and customer data, and editing event information. The admin route is protected, meaning only users with admin privileges can access it. Admin permissions are granted through Clerk’s dashboard by adding a custom role (admin) to the user’s metadata.

Access this using [http://localhost:3000/admin](http://localhost:3000/admin)

## Local Setup

To use SplendEvent locally:

1.  Clone the repository:

```bash
git clone https://github.com/Koalaphant/events-platform.git
```

2. Navigate to the project folder:

```bash
cd events-platform
```

3. Install dependencies

```bash
npm install
```

4. Create a .env file for environment variables.

## Database Setup

1. Set up a PostgreSQL database on [Vercel](https://vercel.com/).
2. In Vercel, navigate to the .env.local tab and reveal the database credentials.
3. Add the following to your .env file:

```env
POSTGRES_URL="************"
POSTGRES_PRISMA_URL="************"
POSTGRES_URL_NO_SSL="************"
POSTGRES_URL_NON_POOLING="************"
POSTGRES_USER="************"
POSTGRES_HOST="************"
POSTGRES_PASSWORD="************"
POSTGRES_DATABASE="************"
```

4. Run the following commands to initialise Prisma and apply migrations to your database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This will generate the Prisma client and create the necessary tables in your database.

## Image storage

1. Create blob object storage on [Vercel](https://vercel.com/).
2. Copy the storage credentials into your .env file

```bash
BLOB_READ_WRITE_TOKEN="***********"
```

## Stripe Payments

1. Sign up for Stripe and enable test mode in the developer section.
2. Add the following Stripe keys to your .env file:

```bash
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="************"
STRIPE_SECRET_KEY="**************"
```

3. To listen for Stripe webhooks, type this into your CLI:

```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

4. Copy the webhook secret and add it to your .env file:

```bash
STRIPE_WEBHOOK_SECRET="**************"
```

## Setting up Clerk Authentication

1. Sign up with Clerk: [https://clerk.com/](hhttps://clerk.com/)
2. Copy the publishable and secret key and add this to your .env file

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="************"
CLERK_SECRET_KEY="************"
```

3. Add the following to your .env file:

```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
```

## Admin Access Setup

1. Have the user sign up on the website: [https://splendevent.vercel.app/sign-up](https://splendevent.vercel.app/sign-up)

2. In the Clerk admin panel, locate the user you want to assign admin privileges to.

3. Under **User Metadata**, add the following:

```json
{ "role": "admin" }
```

The user will now have admin access.

## Database Seeding

Seeding the database will involve using the Ticketmaster API to gather event data and adding mock customer data for the admin panel.

To begin, sign up for a Ticketmaster developer account and add the following to your .env file:

```env
TICKETMASTER_API_KEY="************"
```

Also, add the following to your .env file with your own password for security:

```env
SEED_API_KEY="************"
```

Next, visit the seed endpoint using either insomnia or curl which will seed the database with mock data:

```bash
curl -X POST http://localhost:3000/api/seed -H "x-api-key: YOUR_SEED_API_KEY"
```

## Simulating Event Purchases

To test payments, use the following card details in Stripe’s test mode:

- Card Number: 4242 4242 4242 4242
- Expiry Date: 06/26
- Security Code: Any
- Country: Any
- Postcode: Any

## Requirements

- **Node.js**: v20 or later
- **Next.js**: 14.2.14
- **React**: ^18
- **Prisma**: ^5.20.0
- **Stripe**: ^17.1.0
- **Tailwind CSS**: ^3.4.1
- **Clerk**: ^6.2.1
