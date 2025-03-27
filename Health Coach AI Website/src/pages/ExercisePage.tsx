// src/pages/ExercisePage.tsx
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import supabase from '../supabaseClient';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type ExerciseRecord = {
  id: number;
  created_at: string;
  value: number;
};

export default function ExercisePage() {
  const [exerciseData, setExerciseData] = useState<ExerciseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d' | 'all'>('7d');
  const [activeDays, setActiveDays] = useState<number>(0);

  useEffect(() => {
    fetchExerciseData();
  }, [timeRange]);

  const fetchExerciseData = async () => {
    try {
      setLoading(true);
      setError(null);

      let fromDate = new Date();
      switch (timeRange) {
        case '7d':
          fromDate.setDate(fromDate.getDate() - 7);
          break;
        case '14d':
          fromDate.setDate(fromDate.getDate() - 14);
          break;
        case '30d':
          fromDate.setDate(fromDate.getDate() - 30);
          break;
        case 'all':
          fromDate = new Date(0);
          break;
      }

      const { data, error: queryError } = await supabase
        .from('exercise_logs')
        .select('id, created_at, value')
        .gte('created_at', fromDate.toISOString())
        .order('created_at', { ascending: true });

      if (queryError) throw queryError;

      setExerciseData(data || []);
      calculateExerciseStats(data || []);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exercise data');
      setLoading(false);
    }
  };

  const calculateExerciseStats = (data: ExerciseRecord[]) => {
    // Count unique days with exercise
    const days = new Set(
      data.map(record => new Date(record.created_at).toISOString().split('T')[0])
    ).size;
    setActiveDays(days);
  };

  // Group data by day for the bar chart
  const getDailyExerciseMinutes = () => {
    const dailyData: Record<string, number> = {};
    
    exerciseData.forEach(record => {
      const date = new Date(record.created_at).toISOString().split('T')[0];
      // Assuming each record represents 1 minute of exercise
      dailyData[date] = (dailyData[date] || 0) + 1;
    });

    return Object.entries(dailyData).map(([date, minutes]) => ({
      date,
      minutes
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const dailyExercise = getDailyExerciseMinutes();

  // Prepare chart data
  const chartData = {
    labels: dailyExercise.map(item => item.date),
    datasets: [
      {
        label: 'Exercise Minutes',
        data: dailyExercise.map(item => item.minutes),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw} minutes`;
          }
        }
      }
    }
  };

  // Calculate statistics
  const totalSessions = exerciseData.length;
  const totalMinutes = totalSessions; // Assuming 1 record = 1 minute
  const avgMinutesPerActiveDay = activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0;

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p className="font-medium">Error: {error}</p>
      <button onClick={fetchExerciseData} className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        Retry
      </button>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Exercise Activity</h1>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {(['7d', '14d', '30d', 'all'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-md ${
              timeRange === range ? 'bg-teal-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {range === '7d' ? 'Last 7 Days' : 
             range === '14d' ? 'Last 14 Days' : 
             range === '30d' ? 'Last 30 Days' : 'All Data'}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Active Days" 
          value={activeDays.toString()} 
          icon="🏃"
          description={`out of ${timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : timeRange === '30d' ? 30 : 'all'} days`}
        />
        <StatCard 
          title="Total Minutes" 
          value={totalMinutes.toString()} 
          icon="⏱️"
          description="of exercise"
        />
        <StatCard 
          title="Daily Average" 
          value={avgMinutesPerActiveDay.toString()} 
          icon="📊"
          description="minutes on active days"
        />
      </div>

      {/* Chart container */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Daily Exercise Minutes</h2>
        <div className="h-80">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Recent sessions table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">Recent Exercise Sessions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exerciseData.slice(-20).reverse().map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full">
                      Exercise
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description }: { 
  title: string; 
  value: string; 
  icon: string;
  description?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center">
        <div className="text-2xl mr-3 p-2 bg-teal-100 text-teal-800 rounded-full">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
      </div>
    </div>
  );
}