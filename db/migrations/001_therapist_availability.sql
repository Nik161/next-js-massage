-- Therapist availability: working hours, time off and a no-overlap guarantee for bookings.
-- Times are stored as salon wall-clock time (see app/lib/booking_time.ts).

BEGIN;

-- Weekly working hours
CREATE TABLE therapist_schedules (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
  weekday      smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0 = Sunday
  start_time   time NOT NULL,
  end_time     time NOT NULL,
  CHECK (start_time < end_time)
);

CREATE INDEX therapist_schedules_therapist_weekday_idx
  ON therapist_schedules (therapist_id, weekday);

-- Vacations, sick days, breaks
CREATE TABLE therapist_time_off (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
  starts_at    timestamptz NOT NULL,
  ends_at      timestamptz NOT NULL,
  reason       text,
  CHECK (starts_at < ends_at)
);

CREATE INDEX therapist_time_off_therapist_idx
  ON therapist_time_off (therapist_id, starts_at);

-- Explicit end time, needed for the overlap constraint
ALTER TABLE bookings ADD COLUMN ends_at timestamptz;
UPDATE bookings SET ends_at = date + duration * interval '1 minute';
ALTER TABLE bookings ALTER COLUMN ends_at SET NOT NULL;

-- One therapist can never have two active bookings at the same time
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (therapist_id WITH =, tstzrange(date, ends_at) WITH &&)
  WHERE (status <> 'canceled');

-- Seed: same hours as the old static slots (last 30 min slot starts at 22:30), every day
INSERT INTO therapist_schedules (therapist_id, weekday, start_time, end_time)
SELECT therapists.id, weekday, '09:00', '23:00'
FROM therapists
CROSS JOIN generate_series(0, 6) AS weekday;

COMMIT;
