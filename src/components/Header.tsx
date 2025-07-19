import React from 'react';
import { FlaskRound as Flask } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'algorithms', label: 'Analysis' },
    { id: 'builder', label: 'Analysis Builder' },
    { id: 'scraper', label: 'Web Scraper' },
    { id: 'execution', label: 'Execution' },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Flask className="w-8 h-8 text-white" />
          <h1 className="text-xl font-bold text-white">Laboratory Validation Platform</h1>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white/25 text-white shadow-lg shadow-white/20 transform -translate-y-0.5'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:transform hover:-translate-y-0.5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;