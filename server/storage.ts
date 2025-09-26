import { students, readingTests, type Student, type ReadingTest, type InsertStudent, type InsertReadingTest, type UpdateStudent, type UpdateReadingTest } from "@shared/schema";
export type { Student, ReadingTest, InsertStudent, InsertReadingTest, UpdateStudent, UpdateReadingTest };
import { createDbClient } from "./db";
import { eq } from "drizzle-orm";
import { NeonDatabase } from "drizzle-orm/neon-serverless";
import * as schema from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface Storage {
  getStudent(id: string): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, updates: UpdateStudent): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;
  
  getReadingTest(id: string): Promise<ReadingTest | undefined>;
  getTestsByStudent(studentId: string): Promise<ReadingTest[]>;
  getAllTests(): Promise<ReadingTest[]>;
  createReadingTest(test: InsertReadingTest): Promise<ReadingTest>;
  updateReadingTest(id: string, updates: UpdateReadingTest): Promise<ReadingTest | undefined>;
  deleteReadingTest(id: string): Promise<boolean>;
}

export class PostgresStorage implements Storage {
  private db: NeonDatabase<typeof schema>;

  constructor() {
    this.db = createDbClient();
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await this.db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }

  async getAllStudents(): Promise<Student[]> {
    return await this.db.select().from(students);
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await this.db
      .insert(students)
      .values(insertStudent)
      .returning();
    return student;
  }

  async updateStudent(id: string, updates: UpdateStudent): Promise<Student | undefined> {
    const [student] = await this.db
      .update(students)
      .set(updates)
      .where(eq(students.id, id))
      .returning();
    return student || undefined;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const result = await this.db.delete(students).where(eq(students.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getReadingTest(id: string): Promise<ReadingTest | undefined> {
    const [test] = await this.db.select().from(readingTests).where(eq(readingTests.id, id));
    return test || undefined;
  }

  async getTestsByStudent(studentId: string): Promise<ReadingTest[]> {
    return await this.db.select().from(readingTests).where(eq(readingTests.studentId, studentId));
  }

  async getAllTests(): Promise<ReadingTest[]> {
    return await this.db.select().from(readingTests);
  }

  async createReadingTest(insertTest: InsertReadingTest): Promise<ReadingTest> {
    const [test] = await this.db
      .insert(readingTests)
      .values(insertTest)
      .returning();
    return test;
  }

  async updateReadingTest(id: string, updates: UpdateReadingTest): Promise<ReadingTest | undefined> {
    const [test] = await this.db
      .update(readingTests)
      .set(updates)
      .where(eq(readingTests.id, id))
      .returning();
    return test || undefined;
  }

  async deleteReadingTest(id: string): Promise<boolean> {
    const result = await this.db.delete(readingTests).where(eq(readingTests.id, id));
    return (result.rowCount || 0) > 0;
  }
}

import { InMemoryStorage } from "./in-memory-storage";

export const createStorage = (): Storage => {
  if (process.env.DB_TYPE === "postgres") {
    console.log("Using PostgreSQL database");
    return new PostgresStorage();
  } else {
    console.log("Using in-memory database");
    return new InMemoryStorage();
  }
};
