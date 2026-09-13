/**
 * The queue is a presentation-only quota: the event router appends it to
 * every event so that signups waiting for a place have somewhere to be
 * listed. It has no row in the database, holds no places, and must be left
 * out of any capacity arithmetic.
 */
export const QUEUE_QUOTA_ID = "queue";
