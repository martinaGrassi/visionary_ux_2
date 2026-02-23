import { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend
} from 'recharts';
import { AlertCircle } from 'lucide-react';
import type { HistoryItem } from '../services/gemini';

interface AnalyticsViewProps {
  history: HistoryItem[];
}

export function AnalyticsView({ history }: AnalyticsViewProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const stats = useMemo(() => {
    if (history.length === 0) return null;

    const total = history.length;
    const elegance = Math.round(history.reduce((acc, item) => acc + item.result.scores.elegance, 0) / total);
    const clarity = Math.round(history.reduce((acc, item) => acc + item.result.scores.clarity, 0) / total);
    const modernity = Math.round(history.reduce((acc, item) => acc + item.result.scores.modernity, 0) / total);

    return { total, elegance, clarity, modernity };
  }, [history]);

  const chartData = useMemo(() => {
    return history.map(item => ({
      name: item.result.summary.product.split(' ')[0], // Shorten name
      elegance: item.result.scores.elegance,
      clarity: item.result.scores.clarity,
      modernity: item.result.scores.modernity,
    })).slice(0, 10); // Limit to last 10 for readability
  }, [history]);

  const violationsData = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach(item => {
      item.result.problems.forEach(problem => {
        // Group by problem title
        const key = problem.problem;
        counts[key] = (counts[key] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([name, count]) => {
        // Simplify label for chart
        let shortName = name;
        
        // If it has a colon (e.g. "Visibility: Menu hidden"), take the first part
        if (name.includes(':')) {
          shortName = name.split(':')[0].trim();
        }
        
        // Truncate if still too long
        if (shortName.length > 25) {
          shortName = shortName.substring(0, 25) + '...';
        }

        return { name: shortName, fullName: name, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-[#1c1f26] rounded-full flex items-center justify-center mb-6 border border-white/5">
          <AlertCircle className="w-10 h-10 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No data available</h3>
        <p className="text-gray-500 max-w-sm">
          Run some audits to see analytics and insights about your design reviews.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full space-y-8 pb-20"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white tracking-tight">Analytics & Insights</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={item} className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Sites Analyzed</h3>
          <p className="text-4xl font-bold text-white">{stats?.total}</p>
        </motion.div>
        <motion.div variants={item} className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Avg. Elegance</h3>
          <p className="text-4xl font-bold text-[#bef264]">{stats?.elegance}%</p>
        </motion.div>
        <motion.div variants={item} className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Avg. Clarity</h3>
          <p className="text-4xl font-bold text-[#bef264]">{stats?.clarity}%</p>
        </motion.div>
        <motion.div variants={item} className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Avg. Modernity</h3>
          <p className="text-4xl font-bold text-[#bef264]">{stats?.modernity}%</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Score Trends */}
        <motion.div variants={item} className="bg-[#1c1f26] p-8 rounded-3xl border border-white/5 h-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#4f46e5]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </span>
            <h3 className="text-lg font-semibold text-white">Score Trends</h3>
          </div>
          
          <ResponsiveContainer width="100%" height="85%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis 
                dataKey="name" 
                type="category" 
                stroke="#666" 
                tick={{ fill: '#666', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                type="number" 
                domain={[0, 100]} 
                stroke="#666" 
                tick={{ fill: '#666', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ZAxis type="number" range={[100, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#15171b', borderColor: '#333', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Scatter name="Elegance" data={chartData} dataKey="elegance" fill="#bef264" />
              <Scatter name="Clarity" data={chartData} dataKey="clarity" fill="#4f46e5" />
              <Scatter name="Modernity" data={chartData} dataKey="modernity" fill="#f472b6" />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Common Violations */}
        <motion.div variants={item} className="bg-[#1c1f26] p-8 rounded-3xl border border-white/5 h-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-semibold text-white">Common Heuristic Violations</h3>
          </div>

          <ResponsiveContainer width="100%" height="85%">
            <BarChart 
              layout="vertical" 
              data={violationsData} 
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis type="number" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={150} 
                stroke="#666" 
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#15171b', borderColor: '#333', borderRadius: '12px', color: '#fff' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

      </div>
    </motion.div>
  );
}
