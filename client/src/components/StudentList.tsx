import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, SortAsc, SortDesc, Clock, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student, ReadingTest } from "@shared/schema";
import { calculateStudentAnalytics } from "@/lib/utils";
import StudentCard from "./StudentCard";
import AddStudentModal from "./AddStudentModal";
import * as XLSX from "xlsx";
import { format } from "date-fns";

interface StudentListProps {
  students: Student[];
  tests: ReadingTest[];
  selectedStudent?: Student;
  onStudentSelect: (student: Student) => void;
}

type SortOption = 'last-tested' | 'best-progress' | 'worst-progress' | 'alphabetical';

export default function StudentList({
  students,
  tests,
  selectedStudent,
  onStudentSelect
}: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('last-tested');

  const getStudentTests = (studentId: string) => {
    return tests
      .filter(test => test.studentId === studentId)
      .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
  };

  const getStudentProgress = (studentId: string) => {
    const studentTests = getStudentTests(studentId);
    if (studentTests.length < 2) return 0;
    
    const latest = studentTests[0];
    const previous = studentTests[1];
    return latest.wordsPerMinute - previous.wordsPerMinute;
  };

  const filteredAndSortedStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.grade && student.grade.includes(searchTerm))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'last-tested': {
          const aTests = getStudentTests(a.id);
          const bTests = getStudentTests(b.id);
          if (aTests.length === 0 && bTests.length === 0) return 0;
          if (aTests.length === 0) return 1;
          if (bTests.length === 0) return -1;
          return new Date(bTests[0].testDate).getTime() - new Date(aTests[0].testDate).getTime();
        }
        case 'best-progress':
          return getStudentProgress(b.id) - getStudentProgress(a.id);
        case 'worst-progress':
          return getStudentProgress(a.id) - getStudentProgress(b.id);
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'last-tested': return 'Recently Tested';
      case 'best-progress': return 'Best Progress';
      case 'worst-progress': return 'Needs Attention';
      case 'alphabetical': return 'Alphabetical';
    }
  };

  const exportToExcel = () => {
    const data = students.flatMap(student => {
      const studentTests = tests.filter(t => t.studentId === student.id);
      return studentTests.map(test => ({
        "Student Name": student.name,
        "Grade": student.grade || "N/A",
        "WPM": test.wordsPerMinute,
        "Date": format(new Date(test.testDate), "yyyy-MM-dd"),
        "Time": format(new Date(test.testDate), "HH:mm:ss")
      }));
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reading Tests");
    XLSX.writeFile(workbook, `reading_tests_export_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Students
            <Badge variant="secondary">{filteredAndSortedStudents.length}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              disabled={tests.length === 0}
              className="h-8"
            >
              <Download className="w-4 h-4 mr-2" />
              Export XLS
            </Button>
            <AddStudentModal />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-students"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-48" data-testid="select-sort-students">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-tested">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recently Tested
                </div>
              </SelectItem>
              <SelectItem value="best-progress">
                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4" />
                  Best Progress
                </div>
              </SelectItem>
              <SelectItem value="worst-progress">
                <div className="flex items-center gap-2">
                  <SortDesc className="w-4 h-4" />
                  Needs Attention
                </div>
              </SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredAndSortedStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No students found</p>
            </div>
          ) : (
            filteredAndSortedStudents.map((student) => {
              const studentTests = getStudentTests(student.id);
              const { latestMovingAverage } = calculateStudentAnalytics(studentTests);

              return (
                <StudentCard
                  key={student.id}
                  student={student}
                  tests={studentTests}
                  latestMovingAverage={latestMovingAverage}
                  isSelected={selectedStudent?.id === student.id}
                  onClick={() => onStudentSelect(student)}
                />
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}