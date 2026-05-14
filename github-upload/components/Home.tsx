import React, { useState, useEffect } from 'react';
import { Gem, Link as LinkIcon, ArrowUpRight, FileText, PlaySquare, Image as ImageIcon, Mic, Type, CircleDot, Play, Download, Edit, Trash2, Sparkles, MessageSquare, Folder, User, ArrowUp } from 'lucide-react';

interface HomeProps {
  credits: number;
  onStartChat: (initialPrompt?: string) => void;
  onOpenTextToVideo: () => void;
  onOpenImageToVideo: () => void;
  onPurchaseClick: () => void;
  onNavigate: (view: 'home' | 'transcription' | 'purchase') => void;
}

export const Home: React.FC<HomeProps> = ({ credits, onStartChat, onOpenTextToVideo, onOpenImageToVideo, onPurchaseClick, onNavigate }) => {
  const [showGuide, setShowGuide] = useState(true);

  const placeholders = [
    "生成一段赛博朋克风格的城市夜景...",
    "帮我把这段旅行vlog加上史诗感配乐...",
    "将这段录音转换成会议纪要...",
    "制作一个关于人工智能的科普短视频..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Kept for structure, we can safely remove the placeholder logic since the input is gone.
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-[#12121A] text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#253245] via-[#161B22] to-[#12121A] opacity-80 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#45E0A8] blur-[150px] opacity-10 pointer-events-none rounded-full" />
      <div className="absolute top-20 left-[-100px] w-[400px] h-[400px] bg-[#4A6BFF] blur-[150px] opacity-20 pointer-events-none rounded-full" />

      <div className="relative z-10 p-5 flex flex-col h-full">
        <div className="flex flex-col gap-6 shrink-0 mt-8 mb-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-bold tracking-wide">RecCloud</h1>
            <div 
              onClick={onPurchaseClick}
              className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <Gem size={14} className="text-[#F5C882]" fill="#F5C882" />
              <span className="text-sm font-medium text-gray-200">{credits}</span>
            </div>
          </div>

          {/* Main Features */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            {/* Video Agent */}
            <div 
              onClick={() => onStartChat()}
              className="relative cursor-pointer group rounded-2xl overflow-hidden"
            >
              <img 
                src="/video_agent.png" 
                alt="视频生成Agent" 
                className="w-full h-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextSibling) nextSibling.style.display = 'block';
                }}
              />
              <div className="absolute left-0 bottom-[14%] w-full text-center pointer-events-none">
                <span className="text-white text-[15px] font-medium tracking-wide drop-shadow-md">视频生成Agent</span>
              </div>
              <div style={{ display: 'none' }} className="w-full aspect-[1.3] rounded-2xl overflow-hidden border border-white/10 shadow-lg text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5A85FF] via-[#4A6BFF] to-[#3B5BFF]" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 pb-2">
                  <Play size={44} className="text-white" fill="currentColor" />
                  <span className="font-semibold text-[15px] tracking-wide mt-1">视频生成Agent</span>
                </div>
              </div>
            </div>

            {/* Video Translation */}
            <div className="relative cursor-pointer group rounded-2xl overflow-hidden">
              <img 
                src="/video_translate.png" 
                alt="视频翻译" 
                className="w-full h-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextSibling) nextSibling.style.display = 'block';
                }}
              />
              <div className="absolute left-0 bottom-[14%] w-full text-center pointer-events-none">
                <span className="text-white text-[15px] font-medium tracking-wide drop-shadow-md">视频翻译</span>
              </div>
              <div style={{ display: 'none' }} className="w-full aspect-[1.3] rounded-2xl overflow-hidden border border-white/10 shadow-lg text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5AC8B5] via-[#45E0A8] to-[#32B880]" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 pb-2">
                  <Play size={44} className="text-white" fill="currentColor" />
                  <span className="font-semibold text-[15px] tracking-wide mt-1">视频翻译</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Features */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { id: 'text_to_video', name: '文生视频', file: '/text_to_video.png', icon: FileText, color: 'text-purple-400' },
              { id: 'image_to_video', name: '图生视频', file: '/image_to_video.png', icon: ImageIcon, color: 'text-yellow-400' },
              { id: 'text_to_speech', name: '文字转语音', file: '/text_to_speech.png', icon: Mic, color: 'text-blue-400' },
              { id: 'ai_subtitle', name: 'AI字幕', file: '/ai_subtitle.png', icon: Type, color: 'text-indigo-400' },
            ].map((feat, idx) => (
              <div 
                key={feat.id} 
                onClick={() => {
                  if (feat.id === 'text_to_video') onOpenTextToVideo();
                  if (feat.id === 'image_to_video') onOpenImageToVideo();
                }} 
                className="relative cursor-pointer group rounded-xl overflow-hidden flex flex-col items-center justify-center"
              >
                <img 
                  src={feat.file} 
                  alt={feat.name} 
                  className="w-full h-auto object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextSibling) nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{ display: 'none' }} className="w-full aspect-[0.9] flex-col items-center justify-center gap-2 p-3 bg-[#1C1C24] border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <feat.icon size={22} className={`relative z-10 ${feat.color}`} />
                  </div>
                  <span className="text-[11px] text-gray-300 font-medium whitespace-nowrap">{feat.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-gradient-to-t from-[#12121A] via-[#12121A] to-transparent pointer-events-none">
        <div className="bg-[#1C1C24]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl pointer-events-auto relative">
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <Sparkles size={20} className="text-[#45E0A8]" />
            <span className="text-[10px] text-[#45E0A8] font-medium">创作</span>
          </div>
          <div 
            onClick={() => {
              setShowGuide(false);
              onNavigate('transcription');
            }}
            className="flex flex-col items-center gap-1 cursor-pointer text-gray-500 hover:text-gray-300 transition-colors relative"
          >
            <MessageSquare size={20} />
            <span className="text-[10px] font-medium">转录</span>
            
            {/* Onboarding Guide Tooltip */}
            {showGuide && (
              <div className="absolute bottom-[120%] left-1/2 -ml-[80px] w-[160px] bg-[#45E0A8] text-black text-[11px] font-medium px-3 py-2 rounded-lg shadow-[0_0_20px_rgba(69,224,168,0.4)] animate-bounce z-50 pointer-events-none text-center">
                新功能：语音转文字、视频提取文字都在这里哦！
                <div className="absolute -bottom-1 left-1/2 -ml-1 w-2 h-2 bg-[#45E0A8] rotate-45" />
              </div>
            )}
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
