Database Schema (MySQL 'lms')

Generated: 2026-01-14

Summary of tables and columns (types, nullability, keys, defaults).

_prisma_migrations
- id: varchar(36) — PK, NOT NULL
- checksum: varchar(64) — NOT NULL
- finished_at: datetime(3) — NULL
- migration_name: varchar(255) — NOT NULL
- logs: text — NULL
- rolled_back_at: datetime(3) — NULL
- started_at: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- applied_steps_count: int(10) unsigned — NOT NULL, DEFAULT 0

user
- id: varchar(191) — PK, NOT NULL
- name: varchar(191) — NULL
- email: varchar(191) — NULL, UNIQUE
- emailVerified: datetime(3) — NULL
- image: varchar(191) — NULL
- password: varchar(191) — NULL
- role: varchar(191) — NOT NULL, DEFAULT 'USER'
- isActive: tinyint(1) — NOT NULL, DEFAULT 0
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL

course
- id: varchar(191) — PK, NOT NULL
- userId: varchar(191) — NOT NULL, INDEX
- title: varchar(191) — NOT NULL
- description: varchar(191) — NULL
- imageUrl: varchar(191) — NULL
- price: double — NULL
- isPublished: tinyint(1) — NOT NULL, DEFAULT 0
- categoryId: varchar(191) — NULL, INDEX
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL

chapter
- id: varchar(191) — PK, NOT NULL
- title: varchar(191) — NOT NULL
- description: varchar(191) — NULL
- videoUrl: varchar(191) — NULL
- position: int(11) — NOT NULL
- isPublished: tinyint(1) — NOT NULL, DEFAULT 0
- isFree: tinyint(1) — NOT NULL, DEFAULT 0
- courseId: varchar(191) — NOT NULL, INDEX
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL

account
- id: varchar(191) — PK, NOT NULL
- userId: varchar(191) — NOT NULL, INDEX
- type: varchar(191) — NOT NULL
- provider: varchar(191) — NOT NULL, INDEX
- providerAccountId: varchar(191) — NOT NULL
- refresh_token: varchar(191) — NULL
- access_token: varchar(191) — NULL
- expires_at: int(11) — NULL
- token_type: varchar(191) — NULL
- scope: varchar(191) — NULL
- id_token: varchar(191) — NULL
- session_state: varchar(191) — NULL

attachment
- id: varchar(191) — PK, NOT NULL
- url: varchar(191) — NOT NULL
- courseId: varchar(191) — NULL, INDEX
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL
- chapterId: varchar(191) — NULL, INDEX
- description: varchar(191) — NULL
- title: varchar(191) — NOT NULL
- topicId: varchar(191) — NULL, INDEX
- userId: varchar(191) — NOT NULL, INDEX

category
- id: varchar(191) — PK, NOT NULL
- name: varchar(191) — NOT NULL, UNIQUE
- description: varchar(191) — NULL
- imageUrl: varchar(191) — NULL

comment
- id: varchar(191) — PK, NOT NULL
- text: text — NOT NULL
- userId: varchar(191) — NOT NULL, INDEX
- chapterId: varchar(191) — NULL, INDEX
- topicId: varchar(191) — NULL, INDEX
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL
- parentId: varchar(191) — NULL, INDEX

muxdata
- id: varchar(191) — PK, NOT NULL
- assetId: varchar(191) — NOT NULL
- playbackId: varchar(191) — NULL
- chapterId: varchar(191) — NULL, UNIQUE
- topicId: varchar(191) — NULL, UNIQUE

notification
- id: varchar(191) — PK, NOT NULL
- userId: varchar(191) — NOT NULL, INDEX
- title: varchar(191) — NOT NULL
- message: text — NOT NULL
- type: varchar(191) — NOT NULL
- isRead: tinyint(1) — NOT NULL, DEFAULT 0
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL

option
- id: varchar(191) — PK, NOT NULL
- questionId: varchar(191) — NOT NULL, INDEX
- text: varchar(191) — NOT NULL
- isCorrect: tinyint(1) — NOT NULL, DEFAULT 0
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL
- imageUrl: varchar(191) — NULL

purchase
- id: varchar(191) — PK, NOT NULL
- userId: varchar(191) — NOT NULL, INDEX
- courseId: varchar(191) — NOT NULL, INDEX
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL

question
- id: varchar(191) — PK, NOT NULL
- quizId: varchar(191) — NOT NULL, INDEX
- text: varchar(191) — NOT NULL
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL
- imageUrl: varchar(191) — NULL

quiz
- id: varchar(191) — PK, NOT NULL
- title: varchar(191) — NOT NULL
- description: varchar(191) — NULL
- chapterId: varchar(191) — NULL, UNIQUE
- topicId: varchar(191) — NULL, UNIQUE
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL

session
- id: varchar(191) — PK, NOT NULL
- sessionToken: varchar(191) — NOT NULL, UNIQUE
- userId: varchar(191) — NOT NULL, INDEX
- expires: datetime(3) — NOT NULL

stripecustomer
- id: varchar(191) — PK, NOT NULL
- userId: varchar(191) — NOT NULL, UNIQUE
- stripeCustomerId: varchar(191) — NOT NULL, UNIQUE
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL

topic
- id: varchar(191) — PK, NOT NULL
- title: varchar(191) — NOT NULL
- description: varchar(191) — NULL
- videoUrl: varchar(191) — NULL
- position: int(11) — NOT NULL
- isPublished: tinyint(1) — NOT NULL, DEFAULT 0
- isFree: tinyint(1) — NOT NULL, DEFAULT 0
- chapterId: varchar(191) — NOT NULL, INDEX
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL

userprogress
- id: varchar(191) — PK, NOT NULL
- userId: varchar(191) — NOT NULL, INDEX
- chapterId: varchar(191) — NOT NULL, INDEX
- isCompleted: tinyint(1) — NOT NULL, DEFAULT 0
- createdAt: datetime(3) — NOT NULL, DEFAULT current_timestamp(3)
- updatedAt: datetime(3) — NOT NULL

verificationtoken
- identifier: varchar(191) — NOT NULL, INDEX
- token: varchar(191) — PK, NOT NULL
- expires: datetime(3) — NOT NULL

Notes
- This file was created from the live local database connection. It is a schema snapshot and should be used for reference. For exact CREATE TABLE statements, run SHOW CREATE TABLE <table> in MySQL.
- If you want, I can also export CREATE TABLE statements or save this as a SQL file.
