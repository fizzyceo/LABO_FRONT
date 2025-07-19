import React from 'react';
import { Zap, Play } from 'lucide-react';

interface FloatingActionsProps {
  onQuickBuilder: () => void;
  onQuickRun: () => void;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({ onQuickBuilder, onQuickRun }) => {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4">
      <button
        onClick={onQuickBuilder}
        className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        title="Quick Builder"
      >
        <Zap className="w-6 h-6" />
      </button>
      
      <button
        onClick={onQuickRun}
        className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        title="Quick Run"
      >
        <Play className="w-6 h-6" />
      </button>
    </div>
  );
};

export default FloatingActions;