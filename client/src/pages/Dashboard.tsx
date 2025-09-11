import { useState } from "react";
import { Student, ReadingTest } from "@shared/schema";
import StudentList from "@/components/StudentList";
import TestRecordForm from "@/components/TestRecordForm";
import ProgressChart from "@/components/ProgressChart";
import TestHistory from "@/components/TestHistory";

export default function Dashboard() {
  //todo: remove mock functionality
  const [students] = useState<Student[]>([
    { id: '1', name: 'Emily Johnson', grade: '4' },
    { id: '2', name: 'Marcus Rodriguez', grade: '4' },
    { id: '3', name: 'Sarah Kim', grade: '5' },
    { id: '4', name: 'David Chen', grade: '3' },
    { id: '5', name: 'Aisha Patel', grade: '4' },
    { id: '6', name: 'Jordan Williams', grade: '5' },
  ]);

  const [tests] = useState<ReadingTest[]>([
    // Emily Johnson - showing consistent improvement
    { id: '1', studentId: '1', wordsPerMinute: 125, testDate: new Date('2024-01-15') },
    { id: '2', studentId: '1', wordsPerMinute: 118, testDate: new Date('2024-01-08') },
    { id: '3', studentId: '1', wordsPerMinute: 112, testDate: new Date('2024-01-01') },
    { id: '4', studentId: '1', wordsPerMinute: 105, testDate: new Date('2023-12-25') },
    
    // Marcus Rodriguez - needs attention
    { id: '5', studentId: '2', wordsPerMinute: 85, testDate: new Date('2024-01-10') },
    { id: '6', studentId: '2', wordsPerMinute: 95, testDate: new Date('2024-01-03') },
    { id: '7', studentId: '2', wordsPerMinute: 88, testDate: new Date('2023-12-28') },
    
    // Sarah Kim - advanced reader
    { id: '8', studentId: '3', wordsPerMinute: 155, testDate: new Date('2024-01-12') },
    { id: '9', studentId: '3', wordsPerMinute: 148, testDate: new Date('2024-01-05') },
    
    // David Chen - just started
    { id: '10', studentId: '4', wordsPerMinute: 65, testDate: new Date('2024-01-14') },
    
    // Aisha Patel - steady progress
    { id: '11', studentId: '5', wordsPerMinute: 110, testDate: new Date('2024-01-11') },
    { id: '12', studentId: '5', wordsPerMinute: 102, testDate: new Date('2024-01-04') },
    
    // Jordan Williams - no recent tests
    { id: '13', studentId: '6', wordsPerMinute: 128, testDate: new Date('2023-12-20') },
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(students[0]);

  const getStudentTests = (studentId: string) => {
    return tests.filter(test => test.studentId === studentId);
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleRecordTest = (data: { studentId: string; wordsPerMinute: number; testDate: Date }) => {
    console.log('Recording test:', data);
    // In real app, this would update the tests state
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Reading Speed Tracker</h1>
          <p className="text-muted-foreground">Monitor and track student reading progress</p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Student List */}
          <div className="lg:col-span-1">
            <StudentList
              students={students}
              tests={tests}
              selectedStudent={selectedStudent}
              onStudentSelect={handleStudentSelect}
            />
          </div>

          {/* Right Column - Student Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Recording Form */}
            <TestRecordForm
              students={students}
              selectedStudent={selectedStudent}
              onStudentSelect={(studentId) => {
                const student = students.find(s => s.id === studentId);
                if (student) setSelectedStudent(student);
              }}
              onSubmit={handleRecordTest}
            />

            {/* Selected Student Details */}
            {selectedStudent && (
              <>
                <ProgressChart
                  student={selectedStudent}
                  tests={getStudentTests(selectedStudent.id)}
                />
                <TestHistory
                  student={selectedStudent}
                  tests={getStudentTests(selectedStudent.id)}
                  onDeleteTest={(testId) => console.log('Delete test:', testId)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}