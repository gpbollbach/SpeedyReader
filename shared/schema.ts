import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  grade: text("grade"),
  lastSeen: timestamp("last_seen"),
});

export const readingTests = pgTable("reading_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id, { onDelete: 'cascade' }),
  wordsPerMinute: integer("words_per_minute").notNull(),
  testDate: timestamp("test_date").notNull().default(sql`now()`),
}, (table) => ({
  studentIdIdx: index("idx_reading_tests_student_id").on(table.studentId),
}));

// Relations
export const studentsRelations = relations(students, ({ many }) => ({
  readingTests: many(readingTests),
}));

export const readingTestsRelations = relations(readingTests, ({ one }) => ({
  student: one(students, {
    fields: [readingTests.studentId],
    references: [students.id],
  }),
}));

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
});

export const insertReadingTestSchema = createInsertSchema(readingTests).omit({
  id: true,
}).extend({
  testDate: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return new Date(val);
      }
      return val;
    },
    z.date().optional()
  ).optional(),
});

export const updateStudentSchema = createInsertSchema(students).omit({
  id: true,
}).partial();

export const updateReadingTestSchema = createInsertSchema(readingTests).omit({
  id: true,
  testDate: true,
}).partial();

export type Student = typeof students.$inferSelect;
export type ReadingTest = typeof readingTests.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type InsertReadingTest = z.infer<typeof insertReadingTestSchema>;
export type UpdateStudent = z.infer<typeof updateStudentSchema>;
export type UpdateReadingTest = z.infer<typeof updateReadingTestSchema>;
