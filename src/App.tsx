import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Target, ArrowLeft } from "lucide-react";
import { AuditForm } from "./components/AuditForm";
import { AuditResult } from "./components/AuditResult";
import { Sidebar } from "./components/Sidebar";
import { HistoryView } from "./components/HistoryView";
import { AnalyticsView } from "./components/AnalyticsView";
import { auditWebsite, type UXAuditResult, type HistoryItem } from "./services/gemini";

export default function App() {
  const [result, setResult] = useState<UXAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('audit_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentView, setCurrentView] = useState<'home' | 'history' | 'result' | 'analytics'>('home');

  useEffect(() => {
    localStorage.setItem('audit_history', JSON.stringify(history));
  }, [history]);

  const handleAudit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentView('home'); // Ensure we show loading state on home

    // Check if we already have this URL in history (case-insensitive)
    // We normalize by removing protocol and www for better matching
    const normalizedUrl = url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
    
    const existingEntry = history.find(h => {
      const hUrl = h.url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
      return hUrl === normalizedUrl;
    });

    if (existingEntry) {
      // Simulate a short loading delay for better UX, then show existing result
      setTimeout(() => {
        setResult(existingEntry.result);
        setCurrentView('result');
        setIsLoading(false);
      }, 600);
      return;
    }

    try {
      const data = await auditWebsite(url);
      setResult(data);
      
      // Save to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        url,
        timestamp: Date.now(),
        result: data
      };
      
      setHistory(prev => [newItem, ...prev]);
      setCurrentView('result');
    } catch (err) {
      console.error(err);
      setError("Failed to audit website. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setResult(null);
    setError(null);
    setCurrentView('home');
  };

  const handleNavigate = (view: 'home' | 'history' | 'analytics') => {
    if (view === 'home') {
      setResult(null);
      setError(null);
    }
    setCurrentView(view);
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setResult(item.result);
    setCurrentView('result');
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your history?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-white font-sans selection:bg-[#bef264] selection:text-black flex">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      
      <div className="flex-1 pl-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header / Hero */}
                <header className="mb-16">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="flex flex-col">
                      <h1 className="text-2xl font-bold text-white">Visionary UX</h1>
                      <p className="text-gray-500 text-sm">Ready for today's analysis?</p>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-[#1c1f26] border border-white/10 flex items-center justify-center text-[#bef264] mb-8">
                        <Target className="w-6 h-6" />
                      </div>
                      
                      <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-4 leading-[1.1]">
                        Elevate your design with <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bef264] to-[#4f46e5]">AI-Powered Audits</span>
                      </h2>
                      
                      <p className="text-xl text-gray-400 max-w-2xl leading-relaxed mb-10">
                        Instantly analyze any website's user experience. Discover heuristic violations, get actionable AI suggestions, and improve your design's elegance and clarity.
                      </p>

                      <AuditForm onAudit={handleAudit} isLoading={isLoading} />
                      
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 w-full max-w-md bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3"
                        >
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                          <p className="font-medium">{error}</p>
                        </motion.div>
                      )}
                    </div>

                    {/* Decorative visual for hero */}
                    <div className="hidden lg:block w-96 h-80 relative opacity-50">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#1c1f26] to-[#2a2d36] rounded-3xl border border-white/5 transform rotate-3" />
                      <div className="absolute inset-0 bg-[#1c1f26] rounded-3xl border border-white/5 transform -rotate-3 translate-x-4 translate-y-4 flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="w-16 h-2 bg-[#bef264] rounded-full mb-4 mx-auto" />
                          <div className="w-32 h-2 bg-white/10 rounded-full mb-2 mx-auto" />
                          <div className="w-24 h-2 bg-white/10 rounded-full mx-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                </header>
              </motion.div>
            )}

            {currentView === 'result' && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <button 
                  onClick={handleBack}
                  className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Home
                </button>
                
                <AuditResult result={result} />
              </motion.div>
            )}

            {currentView === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <HistoryView 
                  history={history} 
                  onSelect={handleHistorySelect} 
                  onClearHistory={handleClearHistory}
                />
              </motion.div>
            )}

            {currentView === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <AnalyticsView history={history} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
