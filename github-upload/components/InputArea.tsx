import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ModelMode } from '../types';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  modelMode: ModelMode;
  onModelModeChange: (mode: ModelMode) => void;
  placeholder?: string;
}

export const InputArea: React.FC<InputAreaProps> = ({
  onSendMessage,
  disabled,
  modelMode,
  onModelModeChange,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const activeModelLabel = modelMode === 'advanced' ? '高级模型' : '基础模型';

  return (
    <div className="z-30 w-full flex-shrink-0 bg-gradient-to-t from-[#111111] via-[#111111] to-transparent px-3 pb-7 pt-2">
      <div className="rounded-[18px] border border-white/10 bg-[#23232B] px-4 pb-4 pt-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <textarea
          ref={textareaRef}
          className="custom-scrollbar min-h-[56px] max-h-32 w-full resize-none bg-transparent px-0 py-1 text-[15px] leading-relaxed text-white outline-none placeholder:text-[#6F707A]"
          placeholder={placeholder || '直接描述你想要的视频画面~'}
          rows={2}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={disabled}
        />

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => onModelModeChange(modelMode === 'advanced' ? 'basic' : 'advanced')}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#29422E] px-3 py-1.5 text-[12px] font-medium text-[#9AE46E] transition-colors"
          >
            <Sparkles size={13} />
            <span>{activeModelLabel}</span>
          </button>

          <button
            onClick={() => handleSubmit()}
            disabled={!inputValue.trim() || disabled}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              inputValue.trim() && !disabled
                ? 'bg-[#B9FF5E] text-[#163017] shadow-[0_0_20px_rgba(185,255,94,0.35)]'
                : 'bg-[#B9FF5E]/30 text-[#163017]/50'
            }`}
          >
            {disabled ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-[#163017]/60" />
            ) : (
              <Send size={15} className="translate-x-[1px]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
