import { useState } from 'react';
import TestRecordForm from '../TestRecordForm';
import { Student } from "@shared/schema";

export default function TestRecordFormExample() {
  //todo: remove mock functionality
  const mockStudents: Student[] = [
    { id: '1', name: 'Emily Johnson', grade: '4' },
    { id: '2', name: 'Marcus Rodriguez', grade: '4' },
    { id: '3', name: 'Sarah Kim', grade: '5' }
  ];

  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(mockStudents[0]);

  return (
    <div className="p-4 max-w-md">
      <TestRecordForm
        students={mockStudents}
        selectedStudent={selectedStudent}
        onStudentSelect={(id) => {
          const student = mockStudents.find(s => s.id === id);
          setSelectedStudent(student);
          console.log('Student selected:', student?.name);
        }}
        onSubmit={(data) => console.log('Test submitted:', data)}
      />
    </div>
  );
}