import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { Student } from "@shared/schema";
import WPMCarousel from "./WPMCarousel";

interface TestRecordFormProps {
  students: Student[];
  selectedStudent?: Student;
  onStudentSelect: (studentId: string) => void;
  onSubmit: (data: { studentId: string; wordsPerMinute: number; testDate: Date }) => void;
}

export default function TestRecordForm({
  students,
  selectedStudent,
  onStudentSelect,
  onSubmit
}: TestRecordFormProps) {
  const [wpm, setWpm] = useState(100);
  const [date, setDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !wpm) return;

    // Combine the selected date with the current time to ensure uniqueness
    const submissionDate = new Date();
    submissionDate.setFullYear(date.getFullYear());
    submissionDate.setMonth(date.getMonth());
    submissionDate.setDate(date.getDate());

    onSubmit({
      studentId: selectedStudent.id,
      wordsPerMinute: wpm,
      testDate: submissionDate
    });

    setWpm(100);
    console.log('Test recorded successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="w-5 h-5" />
          Record Reading Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student-select">Select Student</Label>
            <Select 
              value={selectedStudent?.id || ""} 
              onValueChange={onStudentSelect}
              data-testid="select-student"
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a student..." />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} {student.grade && `(Grade ${student.grade})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Reading Speed</Label>
            <WPMCarousel
              value={wpm}
              onChange={setWpm}
              min={20}
              max={300}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Test Date</Label>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-date-picker"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    if (newDate) {
                      setDate(newDate);
                      setShowCalendar(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!selectedStudent || !wpm}
            data-testid="button-record-test"
          >
            Record Test
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}