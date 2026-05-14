import React from 'react';
import { Gem, Mic, Radio, FileAudio, FileVideo, Cloud, Share2, Sparkles, MessageSquare, Folder, User } from 'lucide-react';

interface TranscriptionProps {
  onNavigate: (view: 'home' | 'transcription' | 'purchase') => void;
}

export const Transcription: React.FC<TranscriptionProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full w-full bg-[#12121A] text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-[#2A2B4C] via-[#1A1B3C] to-[#12121A] opacity-50 pointer-events-none" />
      <div className="absolute top-20 right-0 w-64 h-64 bg-[#B388FF] blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute top-40 left-0 w-64 h-64 bg-[#4A6BFF] blur-[120px] opacity-10 pointer-events-none" />

      <div className="relative z-10 p-5 flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-6 shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between mt-8">
          <h1 className="text-2xl font-bold tracking-wide">RecCloud</h1>
          <div 
            onClick={() => onNavigate('purchase')}
            className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5 cursor-pointer hover:bg-white/20 transition-colors"
          >
            <Gem size={14} className="text-[#F5C882]" fill="#F5C882" />
            <span className="text-sm font-medium">1044</span>
          </div>
        </div>

        {/* Recording Modes */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-gray-300">录音模式</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Audio to Text */}
            <div className="relative overflow-hidden rounded-2xl p-4 aspect-[4/3] cursor-pointer group border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A6BFF]/40 to-[#12121A] opacity-80" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg relative">
                  <Mic size={20} className="text-blue-300" />
                  <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-[ping_2s_ease-in-out_infinite]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-[15px]">录音转文字</span>
                  <span className="text-[11px] text-gray-400 mt-1">先录后转</span>
                </div>
              </div>
            </div>

            {/* Real-time Audio to Text */}
            <div className="relative overflow-hidden rounded-2xl p-4 aspect-[4/3] cursor-pointer group border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#45E0A8]/30 to-[#12121A] opacity-80" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg relative">
                  <Radio size={20} className="text-emerald-300" />
                  <div className="absolute -inset-1 rounded-full border border-emerald-400/20 animate-[spin_4s_linear_infinite] border-dashed" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-[15px]">实时录音转文字</span>
                  <span className="text-[11px] text-gray-400 mt-1">边录边转</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Import Files */}
        <div className="flex flex-col gap-3 mt-2">
          <h2 className="text-sm font-medium text-gray-300">导入文件提取文字</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: 'Audio', icon: FileAudio, color: 'text-orange-400', glow: 'bg-orange-400/20' },
              { name: 'Video', icon: FileVideo, color: 'text-blue-400', glow: 'bg-blue-400/20' },
              { name: 'RecCloud', icon: Cloud, color: 'text-cyan-400', glow: 'bg-cyan-400/20' },
              { name: '3rd party', icon: Share2, color: 'text-purple-400', glow: 'bg-purple-400/20' },
            ].map((feat) => (
              <div key={feat.name} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="w-full aspect-square rounded-2xl bg-[#1C1C24] border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:bg-white/10 transition-colors">
                  <div className={`absolute inset-0 ${feat.glow} blur-xl opacity-30`} />
                  <feat.icon size={22} className={`relative z-10 ${feat.color}`} />
                </div>
                <span className="text-[11px] text-gray-400 group-hover:text-gray-200">{feat.name}</span>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* Recent Notes */}
        <div className="flex flex-col gap-3 mt-2 flex-1 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-sm font-medium text-gray-300">最近记录</h2>
            <button className="text-[12px] text-gray-500 hover:text-gray-300 flex items-center">
              更多&gt;&gt;
            </button>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pb-32">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-[#1C1C24] rounded-2xl p-4 flex flex-col gap-2 border border-white/5">
                <h3 className="text-[15px] font-medium text-gray-200 line-clamp-1">
                  我是名称啊名称啊名称啊名称...
                </h3>
                <p className="text-[12px] text-gray-400 line-clamp-2 leading-relaxed">
                  本文探讨了生命的意义,认为生命的意义在于温暖人心的瞬间、连接彼此的情感、连接彼此情感...
                </p>
                <span className="text-[11px] text-gray-500 mt-1">2024-05-16</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-[#12121A] via-[#12121A] to-transparent pointer-events-none">
        <div className="bg-[#1C1C24]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl pointer-events-auto relative">
          <div 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-300 transition-colors"
          >
            <Sparkles size={20} />
            <span className="text-[10px] font-medium">创作</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <MessageSquare size={20} className="text-[#45E0A8]" />
            <span className="text-[10px] text-[#45E0A8] font-medium">转录</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-300 transition-colors">
            <Folder size={20} />
            <span className="text-[10px] font-medium">项目</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-300 transition-colors">
            <User size={20} />
            <span className="text-[10px] font-medium">我的</span>
          </div>
        </div>
      </div>
    </div>
  );
};
