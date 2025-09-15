import {
  type Storage,
  type Student,
  type ReadingTest,
  type InsertStudent,
  type InsertReadingTest,
  type UpdateStudent,
  type UpdateReadingTest,
} from "./storage";
import { randomUUID } from "crypto";

export class InMemoryStorage implements Storage {
  private students: Student[] = [];
  private readingTests: ReadingTest[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // Seed with 3 students
    const student1Id = randomUUID();
    const student2Id = randomUUID();
    const student3Id = randomUUID();

    this.students.push({ id: student1Id, name: "Alice", grade: "5" });
    this.students.push({ id: student2Id, name: "Bob", grade: "4" });
    this.students.push({ id: student3Id, name: "Charlie", grade: "6" });

    // Seed with 2 tests for each student
    this.readingTests.push({ id: randomUUID(), studentId: student1Id, wordsPerMinute: 120, testDate: new Date() });
    this.readingTests.push({ id: randomUUID(), studentId: student1Id, wordsPerMinute: 125, testDate: new Date() });

    this.readingTests.push({ id: randomUUID(), studentId: student2Id, wordsPerMinute: 95, testDate: new Date() });
    this.readingTests.push({ id: randomUUID(), studentId: student2Id, wordsPerMinute: 100, testDate: new Date() });

    this.readingTests.push({ id: randomUUID(), studentId: student3Id, wordsPerMinute: 150, testDate: new Date() });
    this.readingTests.push({ id: randomUUID(), studentId: student3Id, wordsPerMinute: 155, testDate: new Date() });
  }

  async getStudent(id: string): Promise<Student | undefined> {
    return this.students.find((s) => s.id === id);
  }

  async getAllStudents(): Promise<Student[]> {
    return this.students;
  }

  async createStudent(studentData: InsertStudent): Promise<Student> {
    const newStudent: Student = {
      id: randomUUID(),
      ...studentData,
      grade: studentData.grade ?? null,
    };
    this.students.push(newStudent);
    return newStudent;
  }

  async updateStudent(id: string, updates: UpdateStudent): Promise<Student | undefined> {
    const studentIndex = this.students.findIndex((s) => s.id === id);
    if (studentIndex === -1) {
      return undefined;
    }
    const updatedStudent = { ...this.students[studentIndex], ...updates };
    this.students[studentIndex] = updatedStudent;
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const initialLength = this.students.length;
    this.students = this.students.filter((s) => s.id !== id);
    // Also delete their tests
    this.readingTests = this.readingTests.filter((t) => t.studentId !== id);
    return this.students.length < initialLength;
  }

  async getReadingTest(id: string): Promise<ReadingTest | undefined> {
    return this.readingTests.find((t) => t.id === id);
  }

  async getTestsByStudent(studentId: string): Promise<ReadingTest[]> {
    return this.readingTests.filter((t) => t.studentId === studentId);
  }

  async getAllTests(): Promise<ReadingTest[]> {
    return this.readingTests;
  }

  async createReadingTest(testData: InsertReadingTest): Promise<ReadingTest> {
    const newTest: ReadingTest = {
      id: randomUUID(),
      testDate: testData.testDate ?? new Date(),
      ...testData,
    };
    this.readingTests.push(newTest);
    return newTest;
  }

  async updateReadingTest(id: string, updates: UpdateReadingTest): Promise<ReadingTest | undefined> {
    const testIndex = this.readingTests.findIndex((t) => t.id === id);
    if (testIndex === -1) {
      return undefined;
    }
    const updatedTest = { ...this.readingTests[testIndex], ...updates };
    this.readingTests[testIndex] = updatedTest;
    return updatedTest;
  }

  async deleteReadingTest(id: string): Promise<boolean> {
    const initialLength = this.readingTests.length;
    this.readingTests = this.readingTests.filter((t) => t.id !== id);
    return this.readingTests.length < initialLength;
  }
}
