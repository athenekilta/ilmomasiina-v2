# Ilmomasiina v2

A modern event registration system built with Next.js, TypeScript, and Prisma.

## Features

- Event management and registration

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

Use Node.js 24 LTS and npm 10 or newer (Docker uses Node 24).

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a root `.env` file with your local settings, for example:
   ```dotenv
   DATABASE_URL=postgresql://postgres:secret@127.0.0.1:5432/ilmomasiina?schema=public
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=replace-with-a-random-local-secret
   ```
4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   Prisma does not model PostgreSQL triggers. `npm run live` installs the
   idempotent live-update triggers automatically when the gateway starts.
5. Start the Next.js development server:
   ```bash
   npm run dev
   ```
6. To enable live updates, start the gateway in a second terminal:
   ```bash
   npm run live
   ```

`npm start` is an alias for the **development** Next.js server. The live-update
gateway and scheduled worker are separate processes, so a missing database or
live configuration does not prevent Next.js from starting.

For a local production run, configure production environment variables and run
the web server and gateway in separate terminals:

```bash
npm run build
npm run start:production
```

```bash
npm run live
```

`start:production` runs only `next start` and requires an existing build. It does
not build, apply migrations, or start the live-update gateway or worker.

After this you can go and create yourself an account in the ui at [http://localhost:3000]. If you want to test admin features, set your role to admin in prisma studio. More info about prisma studio at the end of the README.md.

If you have modified the schema, you can update the database tables with

```bash
npx prisma generate
npx prisma migrate deploy
```

## Scheduled task worker

The worker removes expired signup reservations and finalizes allocations once per minute. Run it alongside the web server:

```bash
npm run worker
```

Docker Compose starts `app`, `realtime`, and the existing `worker` service:

```bash
docker compose up --build
```

Only one worker instance should run at a time. Do not also run `npm run worker`
against the same database while the Compose worker is running. The live-update
gateway is separate from this worker and does not run scheduled jobs.

## Live-update runtime and deployment

Run the gateway locally with `npm run live`. It serves HTTP `GET /health` and
WebSocket upgrades at `/api/live`. Local startup binds to
`LIVE_HOST=127.0.0.1` and `LIVE_PORT=3001` by default.

In development, the browser connects directly to `ws://<browser-host>:3001/api/live`
instead of sending this additional WebSocket through Next's HMR upgrade handler.
For a different local address, set the complete browser-reachable URL before
starting Next, for example:

```dotenv
NEXT_PUBLIC_LIVE_URL=ws://localhost:4001/api/live
```

Also set the matching `LIVE_HOST` and `LIVE_PORT` for `npm run live`. Because
`NEXT_PUBLIC_LIVE_URL` is included in browser code, never put credentials or
secrets in it. The gateway still requires the exact `NEXTAUTH_URL` browser
origin and authenticates with the short-lived ticket.

Next does not proxy WebSocket traffic in development or production. In
production the browser still connects to the same-origin `/api/live` path, but
the front-end reverse proxy must route that path directly to the gateway.

Compose builds `realtime` from the same full-source `worker` Docker target, but
overrides its command to launch only the gateway. It binds `LIVE_HOST=0.0.0.0`
inside the container and publishes the gateway on host loopback port `3001`, so
host nginx can reach it without exposing it on an external interface. The app
and gateway can restart independently; reconnecting clients perform a resync.

### Database triggers and rollout

Prisma does not represent PostgreSQL trigger functions or triggers. The gateway
therefore applies the idempotent `prisma/live-updates.sql` script before opening
its listener and WebSocket port. This works after either `prisma db push` or
`prisma migrate deploy` and keeps the ordinary schema fully manageable by
Prisma.

The database role used by the gateway must be allowed to create functions and
triggers in the application schema. Startup fails instead of reporting a healthy
gateway with no update source if installation is not possible. Starting the
Compose `realtime` service performs the same installation automatically.

PostgreSQL notifications are **invalidation hints, not a durable event log**.
Changes made while a listener is disconnected are not replayed. Recovery after
a browser WebSocket reconnect or a gateway database-listener reconnect requires
a full refetch of active queries; do not treat reconnection as proof that cached
data is current. The gateway needs a persistent PostgreSQL connection supporting
`LISTEN`/`NOTIFY` (not a transaction-pooled connection).

### TLS and reverse proxies

Serve production browser connections at the app's same-origin
`wss://your-host/api/live`. The TLS-terminating reverse proxy must route that
path directly to the gateway on port `3001`, while ordinary app traffic goes to
Next on port `3000`. For nginx, the `/api/live` location needs, for example:

```nginx
location = /api/live {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;
}
```

This example assumes nginx runs on the Docker host. A proxy in the Compose
network should use `http://realtime:3001` instead. Preserve the browser `Origin`
header and do not expose the gateway as a separate public origin. Hosting must support
long-running Node processes and WebSocket upgrades; a serverless-only deployment
cannot run this gateway. Monitor gateway health and reconnect failures.


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
docker compose build app realtime worker
docker compose run --rm worker npm run prisma-deploy-migrations
docker compose up -d app realtime worker
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

- `npm run dev` / `npm start` - Start the Next development server
- `npm run build` - Build the production app
- `npm run start:production` - Start the Next production server after building
- `npm run live` - Start the live-update gateway separately
- `npm run worker` - Start the single scheduled-task worker separately
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
