import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "motion/react";
import { Search, Loader2 } from "lucide-react";

interface AuditFormProps {
  onAudit: (url: string) => void;
  isLoading: boolean;
}

export function AuditForm({ onAudit, isLoading }: AuditFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAudit(url);
    }
  };

  const handleExample = (exampleUrl: string) => {
    setUrl(exampleUrl);
    onAudit(exampleUrl);
  };

  const examples = ["stripe.com", "linear.app", "apple.com"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="relative group mb-6">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Enter website URL to analyze..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full pl-14 pr-36 py-5 bg-[#1c1f26] border border-white/5 rounded-full text-white text-lg placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#bef264]/50 focus:border-[#bef264]/50 transition-all"
          required
        />
        <div className="absolute inset-y-2 right-2">
          <button
            type="submit"
            disabled={isLoading || !url}
            className="h-full px-8 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing</span>
              </>
            ) : (
              <span>Analyze Now</span>
            )}
          </button>
        </div>
      </form>
      
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>Try these:</span>
        <div className="flex gap-2">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => handleExample(ex)}
              className="px-3 py-1 rounded-full bg-[#1c1f26] border border-white/5 hover:border-white/20 hover:text-gray-300 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
