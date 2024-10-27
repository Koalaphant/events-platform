# SplendEvent 🎟️

SplendEvent is an events platform designed for seamless event signups, payments, and email confirmations. Customers can register and pay for events, receive confirmation emails, and add events directly to their Google Calendar. Users can also sign up for free events, with similar confirmation processes.

There is no traditional account system. Instead, users can request an order history via email by simply entering the email they used to sign up for events.

## View Live Version

- Customer url: [https://events-platform-eta.vercel.app/](https://events-platform-eta.vercel.app/)
- Admin url: [https://events-platform-eta.vercel.app/admin](https://events-platform-eta.vercel.app/admin)

## Technology Stack

- Next.js and TypeScript
- Database: PostgreSQL (With Prisma ORM)
- Hosting: Vercel (including file storage for images)
- Payments: Stripe API for ticket purchases

## Admin Panel

SplendEvent includes an admin panel that allows event management, toggling event availability, viewing sales and customer data, and editing event information. The admin panel is secured by a username and password.

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

4. Copy the webhook secret generated from your CLI and add it to your .env file:

```bash
STRIPE_WEBHOOK_SECRET="**************"
```

## Admin Login Setup

1. Add your admin username to the .env file:

```bash
ADMIN_USERNAME="YOUR_USERNAME_HERE"
```

2. To hash your password:

- Use a command-line tool to hash your password.
- Copy the hashed password and add it to the .env file:

```bash
HASHED_ADMIN_PASSWORD="HASHED_PASSWORD_HERE"
```

### Email Setup

1. Sign up for Resend (it's free).
2. Add the API key and sender email to your .env file:

```bash
RESEND_API_KEY="**************"
SENDER_EMAIL="onboarding@resend.dev"
```

## Database Seeding

Seeding the database will involve using the Ticketmaster API to gather event data and adding mock customer data for the admin panel.

To begin, sign up for a Ticketmaster developer account and add the following to your .env file:

```bash
TICKETMASTER_API_KEY="************"
```

Also, add the following to your .env file with your own password for security:

```bash
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
- Email: Use the email you signed up with on Resend to receive the order confirmation otherwise you will not receive the confirmation email.

## Requirements

- **Node.js**: v20 or later
- **Next.js**: 14.2.14
- **React**: ^18
- **Prisma**: ^5.20.0
- **Stripe**: ^17.1.0
- **Tailwind CSS**: ^3.4.1
