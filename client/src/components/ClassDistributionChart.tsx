import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReadingTest } from '@shared/schema';
import { Users } from 'lucide-react';

interface ClassDistributionChartProps {
  tests: ReadingTest[];
}

const ClassDistributionChart = ({ tests }: ClassDistributionChartProps) => {
  const data = useMemo(() => {
    if (!tests || tests.length === 0) {
      return [];
    }

    const binSize = 20;
    const bins: { [key: string]: number } = {};

    tests.forEach(test => {
      const binStart = Math.floor(test.wordsPerMinute / binSize) * binSize;
      const binEnd = binStart + binSize - 1;
      const binName = `${binStart}-${binEnd}`;

      if (!bins[binName]) {
        bins[binName] = 0;
      }
      bins[binName]++;
    });

    return Object.entries(bins)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        const aStart = parseInt(a.name.split('-')[0]);
        const bStart = parseInt(b.name.split('-')[0]);
        return aStart - bStart;
      });
  }, [tests]);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Class WPM Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No test data available to show distribution.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Class WPM Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Number of Tests" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ClassDistributionChart;
