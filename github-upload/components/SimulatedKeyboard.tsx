import React, { useState } from 'react';
import { ChevronDown, Delete, ArrowUp } from 'lucide-react';

interface SimulatedKeyboardProps {
  isVisible: boolean;
  onClose: () => void;
  onKeyPress?: (key: string) => void;
  onDelete?: () => void;
  onSubmit?: () => void;
}

export const SimulatedKeyboard: React.FC<SimulatedKeyboardProps> = ({ isVisible, onClose, onKeyPress, onDelete, onSubmit }) => {
  const [isShift, setIsShift] = useState(false);
  const [isNumbers, setIsNumbers] = useState(false);

  if (!isVisible) return null;

  const letterRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  const numberRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
    ['.', ',', '?', '!', '\'']
  ];

  const rows = isNumbers ? numberRows : letterRows;

  const handleKeyPress = (key: string) => {
    onKeyPress?.(isShift && !isNumbers ? key.toUpperCase() : key);
    if (isShift) setIsShift(false);
  };

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 h-[260px] bg-[#D1D5DB] dark:bg-[#2A2A2A] pb-safe z-[100] animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] flex flex-col"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex justify-center py-2 bg-[#E5E7EB] dark:bg-[#1F1F1F] border-b border-gray-300 dark:border-white/5 shrink-0">
        <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
          <ChevronDown size={20} />
        </button>
      </div>
      <div className="p-2 flex flex-col gap-2 flex-1 justify-center">
        {rows.map((row, i) => (
          <div key={i} className={`flex justify-center gap-1.5 ${i === 1 ? 'px-4' : ''} ${i === 2 ? 'px-8' : ''}`}>
            {i === 2 && !isNumbers && (
              <button 
                onClick={() => setIsShift(!isShift)}
                className={`flex-1 max-w-[40px] h-10 rounded-lg shadow-sm flex items-center justify-center text-sm font-medium transition-colors ${isShift ? 'bg-white text-black dark:bg-white dark:text-black' : 'bg-[#9CA3AF] text-white dark:bg-[#404040] active:bg-[#6B7280] dark:active:bg-[#505050]'}`}
              >
                <ArrowUp size={18} />
              </button>
            )}
            {i === 2 && isNumbers && (
              <button 
                onClick={() => setIsNumbers(false)}
                className="flex-1 max-w-[40px] h-10 bg-[#9CA3AF] dark:bg-[#404040] rounded-lg shadow-sm flex items-center justify-center text-white text-sm font-medium active:bg-[#6B7280] dark:active:bg-[#505050] transition-colors"
              >
                ABC
              </button>
            )}
            {row.map(key => (
              <button 
                key={key}
                onClick={() => handleKeyPress(key)}
                className="flex-1 max-w-[32px] h-10 bg-white dark:bg-[#3A3A3A] rounded-lg shadow-sm flex items-center justify-center text-black dark:text-white text-lg font-medium active:bg-gray-200 dark:active:bg-[#505050] transition-colors"
              >
                {isShift && !isNumbers ? key.toUpperCase() : key}
              </button>
            ))}
            {i === 2 && (
              <button 
                onClick={onDelete}
                className="flex-1 max-w-[40px] h-10 bg-[#9CA3AF] dark:bg-[#404040] rounded-lg shadow-sm flex items-center justify-center text-white active:bg-[#6B7280] dark:active:bg-[#505050] transition-colors"
              >
                <Delete size={18} />
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-center gap-1.5 mt-1">
          <button 
            onClick={() => setIsNumbers(!isNumbers)}
            className="flex-[1.5] h-10 bg-[#9CA3AF] dark:bg-[#404040] rounded-lg shadow-sm flex items-center justify-center text-white text-sm font-medium active:bg-[#6B7280] dark:active:bg-[#505050] transition-colors"
          >
            {isNumbers ? 'ABC' : '123'}
          </button>
          <button 
            onClick={() => handleKeyPress(' ')}
            className="flex-[5] h-10 bg-white dark:bg-[#3A3A3A] rounded-lg shadow-sm flex items-center justify-center text-black dark:text-white text-sm font-medium active:bg-gray-200 dark:active:bg-[#505050] transition-colors"
          >
            space
          </button>
          <button 
            onClick={onSubmit}
            className="flex-[2] h-10 bg-blue-500 dark:bg-blue-600 rounded-lg shadow-sm flex items-center justify-center text-white text-sm font-medium active:bg-blue-600 dark:active:bg-blue-700 transition-colors"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};
