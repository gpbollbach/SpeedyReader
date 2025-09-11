import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, TrendingUp, TrendingDown, Minus, Trash2 } from "lucide-react";
import { ReadingTest, Student } from "@shared/schema";

interface TestHistoryProps {
  student: Student;
  tests: ReadingTest[];
  onDeleteTest?: (testId: string) => void;
}

export default function TestHistory({ 
  student, 
  tests, 
  onDeleteTest 
}: TestHistoryProps) {
  const sortedTests = tests.sort((a, b) => 
    new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
  );

  const getTrendIcon = (current: ReadingTest, previous?: ReadingTest) => {
    if (!previous) return { icon: Minus, color: "text-muted-foreground" };
    
    const improvement = current.wordsPerMinute - previous.wordsPerMinute;
    if (improvement > 0) {
      return { icon: TrendingUp, color: "text-chart-2" };
    } else if (improvement < 0) {
      return { icon: TrendingDown, color: "text-chart-3" };
    } else {
      return { icon: Minus, color: "text-muted-foreground" };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Test History - {student.name}
          </div>
          <Badge variant="secondary">
            {tests.length} test{tests.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No test history available</p>
            <p className="text-sm">Record a test to start tracking progress</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTests.map((test, index) => {
              const previousTest = sortedTests[index + 1];
              const { icon: TrendIcon, color } = getTrendIcon(test, previousTest);
              const improvement = previousTest 
                ? test.wordsPerMinute - previousTest.wordsPerMinute 
                : 0;

              return (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-3 border border-border rounded-md hover-elevate"
                  data-testid={`row-test-${test.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {test.wordsPerMinute}
                      </div>
                      <div className="text-xs text-muted-foreground">WPM</div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium">
                        {new Date(test.testDate).toLocaleDateString()}
                      </div>
                      {previousTest && (
                        <div className={`flex items-center gap-1 text-xs ${color}`}>
                          <TrendIcon className="w-3 h-3" />
                          <span>
                            {improvement > 0 ? '+' : ''}{improvement} from previous
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        Latest
                      </Badge>
                    )}
                    {onDeleteTest && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log('Delete test:', test.id);
                          onDeleteTest(test.id);
                        }}
                        className="text-muted-foreground hover:text-destructive"
                        data-testid={`button-delete-test-${test.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}