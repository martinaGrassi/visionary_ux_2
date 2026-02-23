import { Home, History, BarChart2, LogOut } from "lucide-react";

interface SidebarProps {
  currentView: 'home' | 'history' | 'result' | 'analytics';
  onNavigate: (view: 'home' | 'history' | 'analytics') => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const isActive = (view: 'home' | 'history' | 'analytics') => {
    if (view === 'home') return currentView === 'home' || currentView === 'result';
    return currentView === view;
  };

  const getButtonClass = (view: 'home' | 'history' | 'analytics') => {
    if (isActive(view)) {
      return "w-10 h-10 rounded-full bg-[#bef264] text-black flex items-center justify-center shadow-[0_0_15px_rgba(190,242,100,0.3)] transition-transform hover:scale-105";
    }
    return "w-10 h-10 rounded-full text-gray-500 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors";
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-[#15171b] border-r border-white/5 flex flex-col items-center py-6 z-50">
      <div className="mb-8">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-bold text-xl">
          V
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-6 w-full items-center">
        <button 
          onClick={() => onNavigate('home')}
          className={getButtonClass('home')}
        >
          <Home className="w-5 h-5" />
        </button>
        <button 
          onClick={() => onNavigate('history')}
          className={getButtonClass('history')}
        >
          <History className="w-5 h-5" />
        </button>
        <button 
          onClick={() => onNavigate('analytics')}
          className={getButtonClass('analytics')}
        >
          <BarChart2 className="w-5 h-5" />
        </button>
      </nav>

      <div className="mt-auto flex flex-col gap-6 items-center">
        <button className="w-10 h-10 rounded-full bg-[#2a2d36] text-gray-400 hover:text-white flex items-center justify-center transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10">
          <img src="https://picsum.photos/seed/user/200" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
