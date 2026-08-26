-- Recreate the Enum to map old values properly
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
CREATE TYPE "UserRole" AS ENUM ('user', 'event_editor', 'superadmin');

-- Update user table's role type
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "UserRole" USING (
  CASE "role"::text
    WHEN 'admin' THEN 'superadmin'::"UserRole"
    ELSE 'user'::"UserRole"
  END
);
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user';

-- Clean up old type
DROP TYPE "UserRole_old";
