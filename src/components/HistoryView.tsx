import { motion } from "motion/react";
import { Clock, ExternalLink, ChevronRight, Trash2 } from "lucide-react";
import type { HistoryItem } from "../services/gemini";

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export function HistoryView({ history, onSelect, onClearHistory }: HistoryViewProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  if (history.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="flex flex-col items-center justify-center h-[60vh] text-center"
      >
        <div className="w-20 h-20 bg-[#1c1f26] rounded-full flex items-center justify-center mb-6 border border-white/5">
          <Clock className="w-10 h-10 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No history yet</h3>
        <p className="text-gray-500 max-w-sm">
          Your past audits will appear here. Start by analyzing a website from the home page.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-5xl pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Analysis History</h2>
        <button 
          onClick={onClearHistory}
          className="text-sm text-gray-500 hover:text-rose-500 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/10"
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4"
      >
        {history.map((entry) => {
          const avgScore = Math.round(
            (entry.result.scores.elegance + entry.result.scores.clarity + entry.result.scores.modernity) / 3
          );
          
          let siteName = entry.url;
          try {
            const urlObj = new URL(entry.url.startsWith('http') ? entry.url : `https://${entry.url}`);
            siteName = urlObj.hostname.replace('www.', '');
          } catch (e) {
            // fallback to url if parsing fails
          }

          return (
            <motion.div
              key={entry.id}
              variants={item}
              onClick={() => onSelect(entry)}
              className="bg-[#1c1f26] border border-white/5 rounded-2xl p-5 hover:border-[#bef264]/30 transition-all cursor-pointer group flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className={`w-16 h-16 rounded-xl bg-[#15171b] flex flex-col items-center justify-center border border-white/5 group-hover:border-[#bef264]/20 transition-colors`}>
                  <span className={`text-xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Score</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-[#bef264] transition-colors capitalize">
                    {siteName}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                    {entry.result.summary.product}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                      <ExternalLink className="w-3 h-3" />
                      {entry.url}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <span>{formatDate(entry.timestamp)}</span>
                  </div>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#bef264] group-hover:text-black transition-all transform group-hover:translate-x-1">
                <ChevronRight className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
