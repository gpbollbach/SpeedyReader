import { type Student, type ReadingTest, type InsertStudent, type InsertReadingTest } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getStudent(id: string): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  
  getReadingTest(id: string): Promise<ReadingTest | undefined>;
  getTestsByStudent(studentId: string): Promise<ReadingTest[]>;
  getAllTests(): Promise<ReadingTest[]>;
  createReadingTest(test: InsertReadingTest): Promise<ReadingTest>;
  deleteReadingTest(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private students: Map<string, Student>;
  private readingTests: Map<string, ReadingTest>;

  constructor() {
    this.students = new Map();
    this.readingTests = new Map();
  }

  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const student: Student = { ...insertStudent, id };
    this.students.set(id, student);
    return student;
  }

  async getReadingTest(id: string): Promise<ReadingTest | undefined> {
    return this.readingTests.get(id);
  }

  async getTestsByStudent(studentId: string): Promise<ReadingTest[]> {
    return Array.from(this.readingTests.values()).filter(
      (test) => test.studentId === studentId,
    );
  }

  async getAllTests(): Promise<ReadingTest[]> {
    return Array.from(this.readingTests.values());
  }

  async createReadingTest(insertTest: InsertReadingTest): Promise<ReadingTest> {
    const id = randomUUID();
    const test: ReadingTest = { 
      ...insertTest, 
      id, 
      testDate: new Date() 
    };
    this.readingTests.set(id, test);
    return test;
  }

  async deleteReadingTest(id: string): Promise<boolean> {
    return this.readingTests.delete(id);
  }
}

export const storage = new MemStorage();
