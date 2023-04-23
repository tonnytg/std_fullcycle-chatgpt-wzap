-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "remote_chat_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chat_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "has_answered" BOOLEAN NOT NULL DEFAULT false,
    "is_from_bot" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
