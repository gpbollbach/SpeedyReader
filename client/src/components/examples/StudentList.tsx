import StudentList from '../StudentList';
import { Student, ReadingTest } from "@shared/schema";

export default function StudentListExample() {
  //todo: remove mock functionality
  const mockStudents: Student[] = [
    { id: '1', name: 'Emily Johnson', grade: '4' },
    { id: '2', name: 'Marcus Rodriguez', grade: '4' },
    { id: '3', name: 'Sarah Kim', grade: '5' },
    { id: '4', name: 'David Chen', grade: '3' },
    { id: '5', name: 'Aisha Patel', grade: '4' }
  ];

  const mockTests: ReadingTest[] = [
    { id: '1', studentId: '1', wordsPerMinute: 125, testDate: new Date('2024-01-15') },
    { id: '2', studentId: '1', wordsPerMinute: 118, testDate: new Date('2024-01-08') },
    { id: '3', studentId: '2', wordsPerMinute: 95, testDate: new Date('2024-01-10') },
    { id: '4', studentId: '2', wordsPerMinute: 88, testDate: new Date('2024-01-03') },
    { id: '5', studentId: '3', wordsPerMinute: 142, testDate: new Date('2024-01-12') },
    { id: '6', studentId: '3', wordsPerMinute: 138, testDate: new Date('2024-01-05') }
  ];

  return (
    <div className="p-4 max-w-2xl">
      <StudentList
        students={mockStudents}
        tests={mockTests}
        selectedStudent={mockStudents[0]}
        onStudentSelect={(student) => console.log('Student selected:', student.name)}
      />
    </div>
  );
}