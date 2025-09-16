import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student, ReadingTest } from '@shared/schema';
import { calculateStudentAnalytics, getInitials } from '@/lib/utils';
import { BarChart2 } from 'lucide-react';

interface StudentAverageChartProps {
  students: Student[];
  tests: ReadingTest[];
}

const StudentAverageChart = ({ students, tests }: StudentAverageChartProps) => {
  const chartData = useMemo(() => {
    return students.map(student => {
      const studentTests = tests.filter(t => t.studentId === student.id);
      const { latestMovingAverage } = calculateStudentAnalytics(studentTests);

      return {
        initials: getInitials(student.name),
        fullName: student.name,
        averageWpm: latestMovingAverage,
      };
    }).sort((a, b) => b.averageWpm - a.averageWpm); // Sort by highest average
  }, [students, tests]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border rounded-md p-3 shadow-md">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm text-chart-1">
            Latest Avg: {data.averageWpm} WPM
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5" />
          Student Average Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="initials" />
            <YAxis allowDecimals={false} domain={['dataMin - 10', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="averageWpm" fill="hsl(var(--chart-1))" name="Latest 3-Test Average WPM" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StudentAverageChart;
