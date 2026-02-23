import { useState, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, CheckCircle2, Sparkles, TrendingUp, Zap, ChevronDown } from "lucide-react";
import type { UXAuditResult } from "../services/gemini";

interface AuditResultProps {
  result: UXAuditResult;
}

function ExpandableCard({ title, content, className = "" }: { title: ReactNode, content: string, className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [content]);

  return (
    <div 
      className={`bg-[#15171b] p-4 rounded-2xl border border-white/5 transition-colors group ${className} ${isOverflowing ? 'cursor-pointer hover:border-white/10' : ''}`}
      onClick={() => isOverflowing && setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start gap-4 mb-2">
        <div className="font-medium text-gray-200 text-sm group-hover:text-[#bef264] transition-colors w-full">
          {title}
        </div>
        {isOverflowing && (
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform shrink-0 mt-0.5 ${isExpanded ? 'rotate-180' : ''}`} />
        )}
      </div>
      <AnimatePresence initial={false}>
        <motion.div
          key="content"
          initial={false}
          animate={{ height: isExpanded || !isOverflowing ? "auto" : "2.5em" }}
          style={{ overflow: "hidden" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <p 
            ref={textRef}
            className={`text-xs text-gray-500 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}
          >
            {content}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function AuditResult({ result }: AuditResultProps) {
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

  // Calculate average score
  const avgScore = Math.round(
    (result.scores.elegance + result.scores.clarity + result.scores.modernity) / 3
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full space-y-6 pb-20"
    >
      {/* Top Grid: Executive Summary & Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Executive Summary Card */}
        <motion.div variants={item} className="lg:col-span-2 bg-[#1c1f26] rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-32 bg-[#bef264] opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:opacity-10 transition-opacity" />
          
          <h3 className="text-xl font-semibold text-white mb-6">Executive Summary</h3>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {result.summary.product}
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {result.summary.targetAudience}
            </p>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-gray-500">Analysis Confidence</span>
              <span className="text-sm font-medium text-gray-500">98%</span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#bef264] w-[98%]" />
            </div>
          </div>
        </motion.div>

        {/* Overall Score Card */}
        <motion.div variants={item} className="bg-[#4f46e5] rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-100" />
          <div className="relative z-10">
            <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-[spin_3s_linear_infinite]" style={{ transform: 'rotate(45deg)' }} />
              <span className="text-4xl font-bold text-white">{avgScore}%</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">UX Score</h3>
            <p className="text-indigo-200 text-sm">Design Quality</p>
          </div>
        </motion.div>
      </div>

      {/* Middle Grid: Violations & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heuristic Violations */}
        <motion.div variants={item} className="bg-[#1c1f26] rounded-3xl p-8 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Heuristic Violations</h3>
            <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-gray-400">
              {result.problems.length} found
            </span>
          </div>

          <div className="space-y-4">
            {result.problems.map((problem, index) => (
              <ExpandableCard 
                key={index}
                title={problem.problem}
                content={problem.whyItMatters}
              />
            ))}
          </div>
        </motion.div>

        {/* AI Opportunities */}
        <motion.div variants={item} className="lg:col-span-2 bg-[#1c1f26] rounded-3xl p-8 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">AI Opportunities</h3>
            <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-gray-400">
              {result.improvements.length + 1} ideas
            </span>
          </div>

          <div className="space-y-4">
            {/* Main Opportunity */}
            <div className="bg-[#4f46e5] p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-20 bg-white opacity-10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Top Suggestion</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">AI-Driven Enhancement</h4>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  {result.aiOpportunity}
                </p>
              </div>
            </div>

            {/* Other Improvements */}
            {result.improvements.map((improvement, index) => (
              <ExpandableCard 
                key={index}
                title={<span className="text-[#818cf8]">Suggestion {index + 2}</span>}
                content={improvement}
                className="bg-[#4f46e5]/10 border-[#4f46e5]/20 hover:border-[#4f46e5]/40"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
