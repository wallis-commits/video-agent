import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { ExampleEntry, Message } from '../types';
import { AudioSelectionCard, CharacterSelectionCard, CostCard, FinalVideoCard, GuideCard, ScriptCard, SettingsCard, StoryboardCard, VideoCard } from './ImmersiveCards';

interface ChatInterfaceProps {
  messages: Message[];
  onCardClick: (msgId: string, action: string, data?: any) => void;
}

const ExampleEntryCard: React.FC<{
  entries: ExampleEntry[];
  onSelect: (entry: ExampleEntry) => void;
}> = ({ entries, onSelect }) => (
  <div className="w-full max-w-[96%] rounded-[20px] bg-[#2A2A2A] p-3 shadow-[0_16px_36px_rgba(0,0,0,0.24)]">
    <div className="space-y-3">
      {entries.map((entry) => (
        <button
          key={entry.id}
          onClick={() => onSelect(entry)}
          className="relative flex h-[118px] w-full overflow-hidden rounded-[16px] text-left"
        >
          <img src={entry.imageUrl} alt={entry.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-black/35" />
          <div className="relative z-10 flex h-full w-full flex-col justify-between p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[20px] font-medium text-white">{entry.title}</div>
                <div className="mt-1 text-[14px] text-white/92">{entry.description}</div>
              </div>
              <div className="shrink-0 text-[14px] font-medium text-[#B8FF73]">查看创作过程 &gt;</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="text-[13px] font-medium text-[#D3FF84]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const MessageItem: React.FC<{
  msg: Message;
  onCardClick: (msgId: string, action: string, data?: any) => void;
}> = ({ msg, onCardClick }) => {
  const isUser = msg.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-full flex-col gap-2 ${isUser ? 'items-end' : 'items-start'} flex-1`}>
        {msg.text && (
          <div
            className={`max-w-[86%] rounded-2xl px-4 py-3 text-[15px] leading-7 shadow-lg ${
              isUser ? 'rounded-br-none bg-[#273923] text-[#F3F7EF]' : 'rounded-bl-none bg-[#2A2A2A] text-[#ECECEC]'
            }`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        )}

        {msg.isLoading && (
          <div className="rounded-2xl rounded-bl-none bg-[#2A2A2A] px-4 py-3 shadow-lg">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#9AE46E] animate-[bounce_1s_infinite_-0.3s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#9AE46E] animate-[bounce_1s_infinite_-0.15s]" />
              <div className="h-1.5 w-1.5 rounded-full bg-[#9AE46E] animate-[bounce_1s_infinite]" />
            </div>
          </div>
        )}

        {!msg.isLoading && msg.type === 'example_entry' && msg.exampleEntries && (
          <ExampleEntryCard entries={msg.exampleEntries} onSelect={(entry) => onCardClick(msg.id, 'open_example_chat', entry)} />
        )}
        {!msg.isLoading && msg.type === 'settings_card' && (
          <SettingsCard
            onConfirm={(settings) => onCardClick(msg.id, 'confirm_settings', settings)}
            initialValues={msg.settingsData}
            readonly={msg.readonly}
          />
        )}
        {!msg.isLoading && msg.type === 'script_card' && msg.scriptData && <ScriptCard data={msg.scriptData} onEdit={() => onCardClick(msg.id, 'open_script', msg.scriptData)} />}
        {!msg.isLoading && (msg.type === 'cost_card' || msg.type === 'quote_card') && msg.costData && (
          <CostCard
            data={msg.costData}
            onConfirm={() => onCardClick(msg.id, 'confirm_cost', msg.costData)}
            onToggleOffPeak={() => onCardClick(msg.id, 'toggle_off_peak')}
          />
        )}
        {!msg.isLoading && msg.type === 'guide_card' && msg.guideData && (
          <GuideCard
            text={msg.guideData.text}
            buttonText={msg.guideData.buttonText}
            onConfirm={() => onCardClick(msg.id, msg.guideData?.action || 'confirm_script_guide')}
          />
        )}
        {!msg.isLoading && msg.type === 'character_card' && msg.characterData && (
          <CharacterSelectionCard
            characters={msg.characterData}
            onConfirm={() => onCardClick(msg.id, 'confirm_characters')}
            onCharacterClick={(char) => onCardClick(msg.id, 'view_character', { initialCharacter: char, allCharacters: msg.characterData })}
          />
        )}
        {!msg.isLoading && msg.type === 'storyboard_card' && msg.storyboardData && (
          <StoryboardCard
            images={msg.storyboardData}
            onImageClick={(img) => onCardClick(msg.id, 'view_image', { initialImage: img, allImages: msg.storyboardData })}
            onConfirm={() => onCardClick(msg.id, 'confirm_storyboard', msg.storyboardData)}
            onEdit={() => onCardClick(msg.id, 'edit_storyboard', msg.storyboardData)}
          />
        )}
        {!msg.isLoading && msg.type === 'audio_selection' && msg.audioOptions && (
          <AudioSelectionCard options={msg.audioOptions} onSelect={(id) => onCardClick(msg.id, 'select_audio', id)} />
        )}
        {!msg.isLoading && msg.type === 'video_card' && msg.videoData && (
          <VideoCard
            thumbnail={msg.videoData.thumbnail}
            duration={msg.videoData.duration}
            segments={msg.videoData.segments}
            onEdit={() => onCardClick(msg.id, 'play_video', msg.videoData)}
          />
        )}
        {!msg.isLoading && msg.type === 'final_video_card' && msg.videoData && (
          <FinalVideoCard
            thumbnail={msg.videoData.thumbnail}
            onEdit={() => onCardClick(msg.id, 'play_video', msg.videoData)}
            onDownloadComplete={() => onCardClick(msg.id, 'download_complete')}
          />
        )}

        {!msg.isLoading && msg.type === 'payment_guide' && (
          <div className="w-full max-w-[95%] rounded-[20px] border border-red-500/20 bg-[#1C1C1E] p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                <Sparkles size={16} className="text-red-400" />
              </div>
              <span className="text-[15px] font-medium text-white">算粒不足</span>
            </div>
            <p className="text-[14px] leading-7 text-gray-300">当前余额不足，无法继续执行这一步操作。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onCardClick }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4 pt-24 custom-scrollbar">
      {messages.map((msg) => (
        <MessageItem key={msg.id} msg={msg} onCardClick={onCardClick} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
