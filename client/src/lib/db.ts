import Dexie, { type Table } from 'dexie';
import { Student, ReadingTest } from '@shared/schema';

export class ReadingTrackerDB extends Dexie {
  students!: Table<Student>;
  tests!: Table<ReadingTest>;

  constructor() {
    super('ReadingTrackerDB');
    this.version(1).stores({
      students: 'id, name, grade',
      tests: 'id, student_id, words_per_minute, test_date'
    });
  }
}

export const db = new ReadingTrackerDB();

// Initialize with sample data if empty
export async function initializeOfflineData(sampleStudents: Student[], sampleTests: ReadingTest[]) {
  const studentCount = await db.students.count();
  if (studentCount === 0) {
    await db.students.bulkAdd(sampleStudents);
  }
  
  const testCount = await db.tests.count();
  if (testCount === 0) {
    await db.tests.bulkAdd(sampleTests);
  }
}
