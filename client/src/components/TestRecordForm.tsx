import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, Play, Pause, Square, RotateCw } from "lucide-react";
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

  // Timer state
  const DURATION = 60;
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleStart = () => {
    if (timeLeft <= 0) {
      setTimeLeft(DURATION);
    }
    setIsTimerActive(true);
  };

  const handlePause = () => {
    setIsTimerActive(false);
  };

  const handleStop = () => {
    setIsTimerActive(false);
    setTimeLeft(0);
  };

  const handleReset = () => {
    setIsTimerActive(false);
    setTimeLeft(DURATION);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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

          <div className="space-y-3">
            <Label>60-Second Timer</Label>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="text-2xl font-semibold font-mono" data-testid="text-timer-display">
                {formatTime(timeLeft)}
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" onClick={handleStart} disabled={isTimerActive}>
                  <Play className="w-5 h-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={handlePause} disabled={!isTimerActive}>
                  <Pause className="w-5 h-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={handleStop}>
                  <Square className="w-5 h-5" />
                </Button>
                <Button type="button" variant="ghost" size="icon" onClick={handleReset}>
                  <RotateCw className="w-5 h-5" />
                </Button>
              </div>
            </div>
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