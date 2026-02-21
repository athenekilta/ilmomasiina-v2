# Ilmomasiina v2

A modern event registration system built with Next.js, TypeScript, and Prisma.

## Features

- Event management and registration
- Raffle system for event spots
- Real-time updates with Pusher
- Modern UI with Tailwind CSS
- Authentication system

## Postgres
If you have docker installed, postgres can be easily run with the following command:
```
docker run -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=postgres -p 127.0.0.1:5432:5432 -v ilmomasiina-postgres:/var/lib/postgresql --name ilmomasiina-v2-dev-db postgres:18
```

After the container has been created, you can start/stop the container with the following docker commands.
```bash
# Start
docker start ilmomasiina-v2-dev-db

# Stop 
docker stop ilmomasiina-v2-dev-db
```

Otherwise, run a postgres instance manually.

Update DATABASE_URL in your .env to match the password & user.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file and configure your variables:
   ```bash
   cp .env.example .env
   ```
4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push 
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

After this you can go and create yourself an account in the ui at [http://localhost:3000]. If you want to test admin features, set your role to admin in prisma studio. More info about prisma studio at the end of the README.md.

If you have modified the schema, you can update the database tables with
   ```bash
   npx prisma generate
   npx prisma migrate deploy 
   ```

## Raffle Worker

The system includes a raffle worker that automatically processes event raffles. To run the worker:

```bash
npm run raffle-worker
```

The worker checks every minute for events with raffles that need to be started and processes them automatically.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

## Tech Stack

- Next.js 15
- TypeScript
- Prisma (Database ORM)
- Tailwind CSS
- tRPC
- NextAuth.js
- Pusher (Real-time updates) 

## Prisma studio
To modify data manually, for example to add admins, you can use the prisma studio. 

Run `npm run studio`
