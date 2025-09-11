import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";
import { ReadingTest, Student } from "@shared/schema";

interface ProgressChartProps {
  student: Student;
  tests: ReadingTest[];
}

export default function ProgressChart({ student, tests }: ProgressChartProps) {
  const chartData = tests
    .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime())
    .map((test) => ({
      date: new Date(test.testDate).toLocaleDateString(),
      wpm: test.wordsPerMinute,
    }));

  const getProgressInfo = () => {
    if (tests.length < 2) return null;
    
    const firstTest = tests[tests.length - 1];
    const lastTest = tests[0];
    const improvement = lastTest.wordsPerMinute - firstTest.wordsPerMinute;
    const improvementPercent = Math.round((improvement / firstTest.wordsPerMinute) * 100);
    
    return { improvement, improvementPercent };
  };

  const progressInfo = getProgressInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Reading Progress - {student.name}
          </div>
          {progressInfo && (
            <div className="text-sm text-muted-foreground">
              {progressInfo.improvement > 0 ? '+' : ''}{progressInfo.improvement} WPM
              {progressInfo.improvementPercent !== 0 && (
                <span className="ml-1">
                  ({progressInfo.improvementPercent > 0 ? '+' : ''}{progressInfo.improvementPercent}%)
                </span>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>No test data available for this student</p>
          </div>
        ) : (
          <div className="h-64" data-testid={`chart-progress-${student.id}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 10', 'dataMax + 10']}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-popover-border rounded-md p-3 shadow-md">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-sm text-chart-1">
                            Reading Speed: {payload[0].value} WPM
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="wpm" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {tests.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Latest: {tests[0].wordsPerMinute} WPM</span>
            <span>{tests.length} total tests</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}