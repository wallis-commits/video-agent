import React, { useState } from 'react';
import { X, History, MessageCircle, Trash2 } from 'lucide-react';

export interface ChatHistory {
  id: string;
  title: string;
  locked?: boolean;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  histories: ChatHistory[];
  currentChatId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  histories,
  currentChatId,
  onSelect,
  onNewChat,
  onDelete,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative flex h-full w-[80%] max-w-[320px] flex-col border-l border-white/10 bg-[#1A1A1A] shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-white/5 p-5">
          <div className="flex items-center gap-2 text-white">
            <History size={18} />
            <span className="text-[15px] font-medium">记录列表</span>
          </div>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex w-full items-center justify-center rounded-lg border border-[#A3B87A] py-2.5 text-[14px] font-medium text-[#A3B87A] transition-colors hover:bg-[#A3B87A]/10"
          >
            新建对话
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto pb-safe">
          {histories.map((history) => (
            <div
              key={history.id}
              className={`group relative flex cursor-pointer items-center gap-3 border-l-2 px-4 py-3.5 transition-colors ${
                currentChatId === history.id ? 'border-[#A3B87A] bg-[#2A2A2A]' : 'border-transparent hover:bg-white/5'
              }`}
              onClick={() => {
                onSelect(history.id);
                onClose();
              }}
            >
              <MessageCircle size={16} className={currentChatId === history.id ? 'text-[#A3B87A]' : 'text-gray-400'} />
              <span className={`flex-1 truncate text-[13px] ${currentChatId === history.id ? 'text-white' : 'text-gray-300'}`}>{history.title}</span>

              {!history.locked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(history.id);
                  }}
                  className="p-1 text-gray-500 opacity-0 transition-all group-hover:opacity-100 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        {deleteConfirmId && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-[260px] rounded-2xl border border-white/10 bg-[#222] p-5 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="mb-2 text-center text-[15px] font-medium text-white">确认删除</h3>
              <p className="mb-5 text-center text-[13px] text-gray-400">删除后将无法恢复该对话记录。</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 rounded-lg bg-white/10 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/20"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    onDelete(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="flex-1 rounded-lg bg-red-500/80 py-2 text-[13px] font-medium text-white transition-colors hover:bg-red-500"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
