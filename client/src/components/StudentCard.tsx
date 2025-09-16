import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Clock, BookOpen, BarChart3 } from "lucide-react";
import { Student, ReadingTest } from "@shared/schema";

interface StudentCardProps {
  student: Student;
  tests: ReadingTest[];
  latestMovingAverage: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function StudentCard({ 
  student, 
  tests,
  latestMovingAverage,
  isSelected = false, 
  onClick 
}: StudentCardProps) {
  const latestTest = tests[0];
  const previousTest = tests[1];
  
  const getTrendInfo = () => {
    if (!latestTest || !previousTest) {
      return { icon: Minus, color: "text-muted-foreground", trend: "No comparison" };
    }
    
    const improvement = latestTest.wordsPerMinute - previousTest.wordsPerMinute;
    if (improvement > 0) {
      return { 
        icon: TrendingUp, 
        color: "text-chart-2", 
        trend: `+${improvement} WPM` 
      };
    } else if (improvement < 0) {
      return { 
        icon: TrendingDown, 
        color: "text-chart-3", 
        trend: `${improvement} WPM` 
      };
    } else {
      return { 
        icon: Minus, 
        color: "text-muted-foreground", 
        trend: "No change" 
      };
    }
  };

  const { icon: TrendIcon, color, trend } = getTrendInfo();
  
  const getLastTestDate = () => {
    if (!latestTest) return "No tests yet";
    return new Date(latestTest.testDate).toLocaleDateString();
  };

  return (
    <Card 
      className={`hover-elevate cursor-pointer transition-colors ${
        isSelected ? 'bg-accent' : ''
      }`}
      onClick={onClick}
      data-testid={`card-student-${student.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate" data-testid={`text-student-name-${student.id}`}>
              {student.name}
            </h3>
            {student.grade && (
              <p className="text-sm text-muted-foreground mt-1">
                Grade {student.grade}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {getLastTestDate()}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {latestTest && (
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground" data-testid={`text-wpm-${student.id}`}>
                  {latestTest.wordsPerMinute} WPM
                </span>
              </div>
            )}
            {latestTest && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium" data-testid={`text-avg-wpm-${student.id}`}>
                  {latestMovingAverage} Avg
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <TrendIcon className={`w-3 h-3 ${color}`} />
              <span className={`text-xs ${color}`} data-testid={`text-trend-${student.id}`}>
                {trend}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {tests.length} test{tests.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}