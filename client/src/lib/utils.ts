import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ReadingTest } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  if (!name) return "?";

  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function calculateStudentAnalytics(tests: ReadingTest[]) {
  if (!tests || tests.length === 0) {
    return {
      chartData: [],
      latestWpm: 0,
      latestMovingAverage: 0,
    };
  }

  const sortedTests = tests
    .slice()
    .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());

  const chartData = sortedTests.map((test, index, allTests) => {
    // Calculate 3-point trailing moving average
    const sliceEnd = index + 1;
    const sliceStart = Math.max(0, sliceEnd - 3);
    const lastThreeTests = allTests.slice(sliceStart, sliceEnd);
    const movingAverage = lastThreeTests.reduce((sum, t) => sum + t.wordsPerMinute, 0) / lastThreeTests.length;

    return {
      date: new Date(test.testDate).toLocaleDateString(),
      wpm: test.wordsPerMinute,
      movingAverage: Math.round(movingAverage),
    };
  });

  const latestTest = sortedTests[sortedTests.length - 1];
  const latestWpm = latestTest.wordsPerMinute;
  const latestMovingAverage = chartData[chartData.length - 1].movingAverage;

  return {
    chartData,
    latestWpm,
    latestMovingAverage,
  };
}
