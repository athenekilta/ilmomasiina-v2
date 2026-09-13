-- Transactional invalidations for LISTEN ilmomasiina_changes. PostgreSQL delivers
-- NOTIFY only on commit and may coalesce identical payloads within a transaction.
-- This is an invalidation feed, not a durable log or an authorization boundary.
-- The gateway must keep user/session messages internal and authorize subscribers.
-- No signup access-control or raffle behavior is changed here.
--
-- prisma db push does not install migration SQL. From the project root, with
-- DATABASE_URL set to the intended development database, run:
--   npx prisma db push
--   npx prisma db execute --file prisma/migrations/20260913130000_live_updates/migration.sql
-- Re-run the second command after a reset/db push creates or replaces tables.
-- This file is idempotent. Historical migrations have legacy "User"/"Session"/
-- "Account" tables, not better-auth's "user"/"session"/"account". Missing current
-- auth tables are deliberately skipped; reapply after db push to install them.
-- This does not repair the earlier user-role migration's lowercase-table drift.
-- Natural passage of expiresAt does not write a row: the gateway must also check
-- expiry itself. Inserts, deletes and changes to expiresAt do notify.

CREATE OR REPLACE FUNCTION ilmomasiina_notify_row_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    old_row jsonb;
    new_row jsonb;
    ignored_columns text[] := ARRAY['updatedAt'];
    change_kind text;
    event_ids integer[];
    target_event_id integer;
    target_user_id text;
    is_public boolean;
BEGIN
    IF TG_OP <> 'INSERT' THEN
        old_row := to_jsonb(OLD);
    END IF;
    IF TG_OP <> 'DELETE' THEN
        new_row := to_jsonb(NEW);
    END IF;

    IF TG_TABLE_NAME = 'Event' THEN
        -- Keep this exclusion list in step with any future raffle-only columns.
        ignored_columns := ignored_columns || ARRAY[
            'raffleEnabled', 'raffleStartTime', 'raffleEndTime', 'raffleStatus'
        ];
    END IF;
    IF TG_OP = 'UPDATE' AND
       (old_row - ignored_columns) IS NOT DISTINCT FROM (new_row - ignored_columns) THEN
        RETURN NULL;
    END IF;

    IF TG_TABLE_NAME IN ('user', 'session', 'account') THEN
        change_kind := CASE WHEN TG_TABLE_NAME = 'user' THEN 'user' ELSE 'session' END;
        -- In the unlikely case of reassignment, invalidate both internal users.
        FOR target_user_id IN
            SELECT DISTINCT value
            FROM unnest(CASE WHEN TG_TABLE_NAME = 'user'
                THEN ARRAY[old_row->>'id', new_row->>'id']
                ELSE ARRAY[old_row->>'userId', new_row->>'userId']
            END) AS ids(value)
            WHERE value IS NOT NULL
        LOOP
            PERFORM pg_notify('ilmomasiina_changes', json_build_object(
                'kind', change_kind, 'userId', target_user_id
            )::text);
        END LOOP;
        RETURN NULL;
    END IF;

    IF TG_TABLE_NAME = 'Event' THEN
        change_kind := 'event';
        event_ids := ARRAY[(old_row->>'id')::integer, (new_row->>'id')::integer];
    ELSIF TG_TABLE_NAME IN ('Quota', 'Question') THEN
        change_kind := 'event';
        event_ids := ARRAY[(old_row->>'eventId')::integer, (new_row->>'eventId')::integer];
    ELSIF TG_TABLE_NAME = 'Signup' THEN
        change_kind := 'signups';
        -- Both sides are needed when moving a signup between events.
        EXECUTE format(
            'SELECT array_agg(DISTINCT "eventId") FROM %I."Quota" WHERE id = ANY($1)',
            TG_TABLE_SCHEMA
        ) INTO event_ids USING ARRAY[old_row->>'quotaId', new_row->>'quotaId'];
    ELSIF TG_TABLE_NAME = 'Answer' THEN
        change_kind := 'signups';
        -- Resolve through the signup's current quota, never put answer data or
        -- signup identifiers in the payload. Both sides cover answer reassignment.
        EXECUTE format(
            'SELECT array_agg(DISTINCT q."eventId") FROM %I."Signup" s
             JOIN %I."Quota" q ON q.id = s."quotaId" WHERE s.id = ANY($1)',
            TG_TABLE_SCHEMA, TG_TABLE_SCHEMA
        ) INTO event_ids USING ARRAY[old_row->>'signupId', new_row->>'signupId'];
    ELSE
        RETURN NULL;
    END IF;

    FOR target_event_id IN
        SELECT DISTINCT value FROM unnest(event_ids) AS ids(value) WHERE value IS NOT NULL
    LOOP
        IF TG_TABLE_NAME = 'Event' THEN
            -- OLD visibility is essential for unpublish, soft delete and hard
            -- delete. Do not combine OLD.draft with NEW.deletedAt (or vice versa).
            is_public :=
                COALESCE((old_row->>'id')::integer = target_event_id
                    AND NOT (old_row->>'draft')::boolean
                    AND old_row->>'deletedAt' IS NULL, false)
                OR COALESCE((new_row->>'id')::integer = target_event_id
                    AND NOT (new_row->>'draft')::boolean
                    AND new_row->>'deletedAt' IS NULL, false);
        ELSE
            -- Qualify lookups with the triggering table's schema rather than the
            -- writer's search_path. Related rows use current event visibility.
            EXECUTE format(
                'SELECT NOT draft AND "deletedAt" IS NULL FROM %I."Event" WHERE id = $1',
                TG_TABLE_SCHEMA
            ) INTO is_public USING target_event_id;
        END IF;
        PERFORM pg_notify('ilmomasiina_changes', json_build_object(
            'kind', change_kind, 'eventId', target_event_id,
            'public', COALESCE(is_public, false)
        )::text);
    END LOOP;
    RETURN NULL;
END;
$$;

DO $$
DECLARE
    target_table text;
    target_schema text := current_schema();
BEGIN
    FOREACH target_table IN ARRAY ARRAY[
        'Event', 'Quota', 'Question', 'Signup', 'Answer', 'user', 'session', 'account'
    ] LOOP
        IF to_regclass(format('%I.%I', target_schema, target_table)) IS NOT NULL THEN
            EXECUTE format('DROP TRIGGER IF EXISTS ilmomasiina_row_change ON %I.%I',
                target_schema, target_table);
            EXECUTE format(
                'CREATE TRIGGER ilmomasiina_row_change AFTER INSERT OR UPDATE OR DELETE
                 ON %I.%I FOR EACH ROW EXECUTE FUNCTION %I.ilmomasiina_notify_row_change()',
                target_schema, target_table, target_schema
            );
        END IF;
    END LOOP;
END;
$$;
