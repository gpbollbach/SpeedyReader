import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Student, ReadingTest } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import StudentList from "@/components/StudentList";
import TestRecordForm from "@/components/TestRecordForm";
import ProgressChart from "@/components/ProgressChart";
import TestHistory from "@/components/TestHistory";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();

  // Fetch students
  const { data: students = [], isLoading: studentsLoading, error: studentsError } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  // Fetch all tests
  const { data: tests = [], isLoading: testsLoading } = useQuery<ReadingTest[]>({
    queryKey: ['/api/tests'],
  });

  // Set first student as selected when students load
  if (students.length > 0 && !selectedStudent) {
    setSelectedStudent(students[0]);
  }

  // Create test mutation
  const createTestMutation = useMutation({
    mutationFn: async (data: { studentId: string; wordsPerMinute: number; testDate: Date }) => {
      const response = await apiRequest('POST', '/api/tests', {
        studentId: data.studentId,
        wordsPerMinute: data.wordsPerMinute,
        testDate: data.testDate.toISOString(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tests'] });
      toast({
        title: "Success!",
        description: "Reading test recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to record test: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete test mutation
  const deleteTestMutation = useMutation({
    mutationFn: async (testId: string) => {
      await apiRequest('DELETE', `/api/tests/${testId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tests'] });
      toast({
        title: "Success!",
        description: "Test deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete test: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const getStudentTests = (studentId: string) => {
    return tests.filter(test => test.studentId === studentId);
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleRecordTest = (data: { studentId: string; wordsPerMinute: number; testDate: Date }) => {
    createTestMutation.mutate(data);
  };

  const handleDeleteTest = (testId: string) => {
    deleteTestMutation.mutate(testId);
  };

  // Show loading state
  if (studentsLoading || testsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (studentsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error loading students: {studentsError.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Reading Speed Tracker</h1>
          <p className="text-muted-foreground">Monitor and track student reading progress</p>
        </div>

        {/* Main Layout - 3 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Column 1: Student List */}
          <div className="lg:col-span-5">
            <StudentList
              students={students}
              tests={tests}
              selectedStudent={selectedStudent}
              onStudentSelect={handleStudentSelect}
            />
          </div>

          {/* Column 2: Record Test Form */}
          <div className="lg:col-span-3">
            <TestRecordForm
              students={students}
              selectedStudent={selectedStudent}
              onStudentSelect={(studentId) => {
                const student = students.find(s => s.id === studentId);
                if (student) setSelectedStudent(student);
              }}
              onSubmit={handleRecordTest}
            />
          </div>

          {/* Column 3: Progress and History */}
          <div className="lg:col-span-4 space-y-6">
            {selectedStudent ? (
              <>
                <ProgressChart
                  student={selectedStudent}
                  tests={getStudentTests(selectedStudent.id)}
                />
                <TestHistory
                  student={selectedStudent}
                  tests={getStudentTests(selectedStudent.id)}
                  onDeleteTest={handleDeleteTest}
                />
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-muted-foreground bg-muted/20 rounded-lg">
                <p>Select a student to see their progress</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}