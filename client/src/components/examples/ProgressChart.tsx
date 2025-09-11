import ProgressChart from '../ProgressChart';
import { Student, ReadingTest } from "@shared/schema";

export default function ProgressChartExample() {
  //todo: remove mock functionality
  const mockStudent: Student = {
    id: '1',
    name: 'Emily Johnson',
    grade: '4'
  };

  const mockTests: ReadingTest[] = [
    { id: '5', studentId: '1', wordsPerMinute: 125, testDate: new Date('2024-01-15') },
    { id: '4', studentId: '1', wordsPerMinute: 118, testDate: new Date('2024-01-08') },
    { id: '3', studentId: '1', wordsPerMinute: 112, testDate: new Date('2024-01-01') },
    { id: '2', studentId: '1', wordsPerMinute: 105, testDate: new Date('2023-12-25') },
    { id: '1', studentId: '1', wordsPerMinute: 98, testDate: new Date('2023-12-18') }
  ];

  return (
    <div className="p-4">
      <ProgressChart 
        student={mockStudent}
        tests={mockTests}
      />
    </div>
  );
}