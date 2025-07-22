-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "solarDate" TEXT NOT NULL,
    "lunarDate" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "response" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "user_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "wu_xing_lun_ming" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wh" TEXT,
    "whtj" TEXT,
    "rgz" TEXT,
    "rgpd" TEXT,
    "rgxx" TEXT,
    "rgzfx" TEXT,
    "xgfx" TEXT,
    "aqfx" TEXT,
    "syfx" TEXT,
    "cyfx" TEXT,
    "jkfx" TEXT
);

-- CreateTable
CREATE TABLE "ri_gan_lun_ming" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rgz" TEXT,
    "rgxx" TEXT,
    "rgcz" TEXT,
    "rgzfx" TEXT,
    "xgfx" TEXT,
    "aqfx" TEXT,
    "syfx" TEXT,
    "cyfx" TEXT,
    "jkfx" TEXT
);

-- CreateTable
CREATE TABLE "ri_yue_shi_ming_li" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siceng" TEXT,
    "mingmi" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "calendar_events_title_userId_key" ON "calendar_events"("title", "userId");
