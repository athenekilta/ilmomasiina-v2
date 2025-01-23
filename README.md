# Ilmomasiina v2

A modern event registration system built with Next.js, TypeScript, and Prisma.

## Features

- Event management and registration
- Raffle system for event spots
- Real-time updates with Pusher
- Modern UI with Tailwind CSS
- Authentication system

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
   npx prisma migrate deploy
   ```
5. Run the development server:
   ```bash
   npm run dev
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