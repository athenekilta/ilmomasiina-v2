# Ilmomasiina v2

A modern event registration system built with Next.js, TypeScript, and Prisma.

## Features

- Event management and registration
- Raffle system for event spots
- Modern UI with Tailwind CSS
- Authentication system

## Postgres

If you have docker installed, postgres can be easily run with the following command:

```
docker run -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=postgres -p 127.0.0.1:5432:5432 -v ilmomasiina-postgres:/var/lib/postgresql --name ilmomasiina-v2-dev-db postgres:18-trixie
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

## Scheduled task worker

The worker processes scheduled raffles, removes expired signup reservations, and finalizes allocations once per minute. Run it alongside the web server:

```bash
npm run worker
```

Docker Compose starts the `app` and `worker` services automatically:

```bash
docker compose up --build
```

Only one worker instance should run at a time.

## Event images

Admins can select, replace, or remove an event banner in the event editor.
Image changes take effect on **Save**. The app uploads and processes a selected
file before saving the event, quotas, questions, and image reference in one
database transaction. Cancelling an edit does not change the saved image.

JPEG, PNG, and WebP inputs are limited to 10 MiB and 25 megapixels; animations
are rejected. Sharp applies orientation, center-crops to 5:2, and creates WebP
card/banner variants up to 800×320 and 1600×640 without enlargement. Images must
be at least 5 pixels wide and 2 pixels high after orientation. Originals and
metadata are discarded. The app permits two concurrent uploads, limits receiving
a body to 30 seconds, and limits each variant's processing to 10 seconds.

`EVENT_IMAGE_STORAGE_DIR` defaults to `data/event-images` in local development.
Compose mounts the named `event-images` volume at `/app/data/event-images` in
both app and worker. Both containers run as `node` (UID/GID 1000); custom bind
mounts and restored volumes must be writable by that user. Keep the same Compose
project name across deployments so it resolves to the same volume.

Images are public, including draft images, and use unguessable immutable URLs.
Replacement creates a new URL. Removal cannot revoke browser-cached copies.
Only processed files are served, using fixed `card` and `banner` variants.
Storage is local to one Docker host; multiple hosts require shared/object storage
behind the storage module before adding app replicas.

The existing worker expires abandoned uploads after 24 hours, retains replaced
or removed images for another 24 hours, and retries filesystem deletion failures.
Images referenced by events, including soft-deleted events, are retained. Future
permanent event deletion must retire its image. A PostgreSQL row lock prevents
cleanup and attachment from racing. The uploader ID is recorded as audit data
without an auth-table foreign key; access is checked against the current user
and role when uploading or attaching an image.

Deploy the additive image migration before starting the updated services:

```bash
docker compose build app worker
docker compose run --rm worker npm run prisma-deploy-migrations
docker compose up -d app worker
```

Never use `docker compose down -v` during routine deployment: it removes the
database and image volumes. Configure a reverse proxy to permit at least 10 MiB
request bodies and allow the upload plus processing time (for nginx, for example,
`client_max_body_size 10m` and `proxy_read_timeout 60s`). Configure the canonical
`NEXTAUTH_URL` to match the browser origin; the upload endpoint rejects other
origins. Monitor host free space/inodes and container memory, and inspect app/
worker logs for upload, read, and cleanup failures. Disk exhaustion fails the save
without replacing the existing event image. Tune limits only after measuring
concurrent registration traffic alongside uploads.

### Back up and restore event images

Back up PostgreSQL and the image volume together. Stop app and worker writes
while taking the pair; copy the resulting files off the Docker host. These
commands assume the Compose database is named `ilmomasiina`:

```bash
mkdir -p backups
docker compose stop app worker
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -Fc ilmomasiina' > backups/database.dump
docker compose run --rm --no-deps --user root -v "$PWD/backups:/backup" worker tar -C /app/data/event-images -czf /backup/event-images.tgz .
docker compose start app worker
```

For a restore, keep app and worker stopped, restore the matching database dump
into the target database, and extract into an **empty** image volume. The database
restore below replaces existing database objects; use it only for an intentional
restore into the selected environment:

```bash
docker compose stop app worker
docker compose exec -T db sh -c 'pg_restore -U "$POSTGRES_USER" --clean --if-exists -d ilmomasiina' < backups/database.dump
docker compose run --rm --no-deps --user root -v "$PWD/backups:/backup:ro" worker tar -C /app/data/event-images -xzf /backup/event-images.tgz
docker compose run --rm --no-deps --user root worker chown -R node:node /app/data/event-images
docker compose start app worker
```

Verify a restored event's card and banner URLs and perform an upload before
declaring the restore successful. Database-only backups cannot recover images.

### Image tests

`npm run test:images` exercises processing, request limits, and storage. Database
tests are opt-in through `IMAGE_TEST_DATABASE_URL`, which must point to an
isolated disposable database; they never implicitly use `DATABASE_URL`.

```bash
IMAGE_TEST_DATABASE_URL=postgresql://postgres:password@localhost:5432/image_tests npm run test:images
```

Apply migrations to the test database first. The repository's older migrations
still describe the previous auth tables; if creating a fresh integration database,
also run `prisma db push` against **that disposable database** to initialize the
current Better Auth tables. Resolving that pre-existing auth migration mismatch
is separate from the additive image migration.

## Prisma commands in Docker

The worker image includes the Prisma CLI, configuration, schema, and migrations. Rebuild it after changing these files:

```bash
docker compose build worker
```

Apply committed migrations:

```bash
docker compose run --rm worker npm run prisma-deploy-migrations
```

Push the schema directly during development:

```bash
docker compose run --rm worker npm run prisma-db-push
```

Create migrations on the host so the generated files remain in the working tree, then apply them through Docker:

```bash
npx prisma migrate dev --name migration_name
docker compose run --rm worker npm run prisma-deploy-migrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues

## Tech Stack

- Next.js 16
- TypeScript
- Prisma (Database ORM)
- Tailwind CSS
- tRPC
- NextAuth.js

## Prisma studio

To modify data manually, for example to add admins, you can use the prisma studio.

Run `npm run studio`
