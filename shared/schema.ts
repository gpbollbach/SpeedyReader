import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  grade: text("grade"),
});

export const readingTests = pgTable("reading_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull(),
  wordsPerMinute: integer("words_per_minute").notNull(),
  testDate: timestamp("test_date").notNull().default(sql`now()`),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
});

export const insertReadingTestSchema = createInsertSchema(readingTests).omit({
  id: true,
  testDate: true,
});

export type Student = typeof students.$inferSelect;
export type ReadingTest = typeof readingTests.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertReadingTest = z.infer<typeof insertReadingTestSchema>;
