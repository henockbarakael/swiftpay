-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT,
    "birthDate" TIMESTAMP(3),
    "gender" TEXT NOT NULL DEFAULT 'M',
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "picture" TEXT,
    "isActive" BOOLEAN DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "phone" TEXT,
    "NbFailedAttempts" INTEGER NOT NULL DEFAULT 0,
    "temporaryLockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "identifier" TEXT NOT NULL,
    "isPhoneNumber" BOOLEAN DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_identifier_key" ON "users"("identifier");
