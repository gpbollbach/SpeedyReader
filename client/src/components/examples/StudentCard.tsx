import StudentCard from '../StudentCard';
import { Student, ReadingTest } from "@shared/schema";

export default function StudentCardExample() {
  //todo: remove mock functionality
  const mockStudent: Student = {
    id: '1',
    name: 'Emily Johnson',
    grade: '4'
  };

  const mockTests: ReadingTest[] = [
    {
      id: '1',
      studentId: '1',
      wordsPerMinute: 125,
      testDate: new Date('2024-01-15')
    },
    {
      id: '2', 
      studentId: '1',
      wordsPerMinute: 118,
      testDate: new Date('2024-01-08')
    }
  ];

  return (
    <div className="p-4 max-w-sm">
      <StudentCard 
        student={mockStudent}
        tests={mockTests}
        onClick={() => console.log('Student selected')}
      />
    </div>
  );
}