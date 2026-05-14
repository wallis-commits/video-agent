import React, { useEffect, useState } from 'react';
import { ArrowUp, ChevronLeft, ChevronRight, Download, Edit2, Maximize2, Play, RefreshCw, Type, User, X } from 'lucide-react';
import { CharacterDesign, ScriptData, ScriptLine, StoryboardImage, VideoSegment } from '../types';

interface ScriptEditorProps {
  initialData: ScriptData;
  onClose: () => void;
  onConfirm: (newData: ScriptData) => void;
  onAiEditRequest: (prompt: string, onSuccess?: () => void) => void;
}

const AutoGrowTextarea = ({
  value,
  onChange,
  className,
  readOnly = false,
}: {
  value: string;
  onChange?: (val: string) => void;
  className?: string;
  readOnly?: boolean;
}) => {
  return (
    <textarea
      value={value}
      readOnly={readOnly}
      rows={1}
      onChange={(e) => {
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        onChange?.(e.target.value);
      }}
      onInput={(e) => {
        const target = e.currentTarget;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
      }}
      ref={(node) => {
        if (node) {
          node.style.height = 'auto';
          node.style.height = `${node.scrollHeight}px`;
        }
      }}
      className={`w-full resize-none overflow-hidden bg-transparent focus:outline-none ${className || ''}`}
    />
  );
};

const AiPromptBar = ({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}) => (
  <div className="px-4 pb-6 pt-3">
    <div className="rounded-[18px] border border-white/10 bg-[#2A2A30] px-3 py-2">
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="输入AI指令，比如：重新生成剧本"
          className="h-10 flex-1 bg-transparent text-[14px] text-white placeholder:text-[#777983] focus:outline-none"
        />
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            value.trim() ? 'bg-[#B9FF5E] text-[#183118]' : 'bg-[#404046] text-[#808087]'
          }`}
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
    <p className="mt-3 text-center text-[12px] text-[#7D7D83]">内容由AI生成，仅供参考 △</p>
  </div>
);

const BasicScriptEditor = ({
  data,
  lines,
  setLines,
  characters,
  setCharacters,
}: {
  data: ScriptData;
  lines: ScriptLine[];
  setLines: React.Dispatch<React.SetStateAction<ScriptLine[]>>;
  characters: ScriptData['characters'];
  setCharacters: React.Dispatch<React.SetStateAction<ScriptData['characters']>>;
}) => (
  <div className="space-y-5 px-4 pb-4 pt-3">
    <section className="rounded-[20px] bg-[#37373C] p-4">
      <h3 className="mb-4 text-[15px] font-semibold text-white">角色定妆(X)</h3>
      <div className="space-y-3">
        {data.characters.map((char) => (
          <div key={char.id} className="rounded-[12px] bg-[#4A4A4F] px-4 py-3">
            <div className="mb-2 text-[14px] font-medium text-[#B6F46C]">Name</div>
            <AutoGrowTextarea
              value={characters.find((item) => item.id === char.id)?.description || char.description}
              onChange={(val) => setCharacters((prev) => prev.map((item) => (item.id === char.id ? { ...item, description: val } : item)))}
              className="text-[14px] leading-6 text-white/90"
            />
          </div>
        ))}
      </div>
    </section>

    <section className="rounded-[20px] bg-[#37373C] p-4">
      <h3 className="mb-4 text-[15px] font-semibold text-white">分镜内容(X)</h3>
      <div className="space-y-4">
        {lines.map((line, index) => (
          <div key={line.id} className="relative rounded-[16px] bg-[#4A4A4F] p-4">
            <div className="absolute -left-3 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#717178] text-[13px] text-white">
              {index + 1}
            </div>
            <div className="mb-3 text-[14px] font-semibold text-[#B6F46C]">画面描述</div>
            <div className="rounded-[12px] bg-[#5A5A60] px-4 py-3">
              <AutoGrowTextarea
                value={line.visual}
                onChange={(val) => setLines((prev) => prev.map((item) => (item.id === line.id ? { ...item, visual: val } : item)))}
                className="text-[14px] leading-6 text-white"
              />
            </div>
            <div className="mb-3 mt-4 text-[14px] font-semibold text-[#78B5FF]">音频台词</div>
            <div className="rounded-[12px] bg-[#5A5A60] px-4 py-3">
              <AutoGrowTextarea
                value={line.audio || ''}
                onChange={(val) => setLines((prev) => prev.map((item) => (item.id === line.id ? { ...item, audio: val, subtitle: val } : item)))}
                className="text-[14px] leading-6 text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const AdvancedScriptEditor = ({
  data,
  lines,
  setLines,
  characters,
  setCharacters,
}: {
  data: ScriptData;
  lines: ScriptLine[];
  setLines: React.Dispatch<React.SetStateAction<ScriptLine[]>>;
  characters: ScriptData['characters'];
  setCharacters: React.Dispatch<React.SetStateAction<ScriptData['characters']>>;
}) => (
  <div className="space-y-5 px-4 pb-4 pt-3">
    <section className="rounded-[20px] bg-[#37373C] p-4">
      <h3 className="mb-4 text-[15px] font-semibold text-white">角色介绍(X)</h3>
      <div className="space-y-3">
        {data.characters.map((char) => (
          <div key={char.id} className="rounded-[12px] bg-[#4A4A4F] px-4 py-3">
            <div className="mb-2 text-[14px] font-medium text-[#B6F46C]">Name</div>
            <AutoGrowTextarea
              value={characters.find((item) => item.id === char.id)?.description || char.description}
              onChange={(val) => setCharacters((prev) => prev.map((item) => (item.id === char.id ? { ...item, description: val } : item)))}
              className="text-[14px] leading-6 text-white/90"
            />
          </div>
        ))}
      </div>
    </section>

    <section className="rounded-[20px] bg-[#37373C] p-4">
      <h3 className="mb-4 text-[15px] font-semibold text-white">分镜内容(X)</h3>
      <div className="space-y-3">
        {lines.map((line, index) => (
          <div key={line.id} className="flex gap-3 rounded-[12px] bg-[#4A4A4F] px-4 py-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#77A95C] text-[14px] text-white">{index + 1}</div>
            <div className="flex-1">
              <AutoGrowTextarea
                value={line.visual}
                onChange={(val) => setLines((prev) => prev.map((item) => (item.id === line.id ? { ...item, visual: val } : item)))}
                className="text-[14px] leading-7 text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export const ScriptEditor: React.FC<ScriptEditorProps> = ({ initialData, onClose, onConfirm, onAiEditRequest }) => {
  const [lines, setLines] = useState<ScriptLine[]>(initialData.lines);
  const [characters, setCharacters] = useState(initialData.characters);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 240);
  };

  const handleSave = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm({ ...initialData, lines, characters });
    }, 240);
  };

  const handleAiSend = () => {
    if (!aiPrompt.trim()) return;
    setIsClosing(true);
    setTimeout(() => {
      onAiEditRequest(aiPrompt, onClose);
    }, 180);
  };

  return (
    <div className={`absolute inset-0 z-50 flex flex-col bg-[#2E2E34] transition-all duration-200 ${isClosing ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
      <div className="flex items-center justify-between px-4 pb-3 pt-5">
        <div className="w-8" />
        <h2 className="text-[16px] font-semibold text-white">剧本编辑</h2>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="text-white/90 hover:text-white">
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {initialData.modelMode === 'basic' ? (
          <BasicScriptEditor data={initialData} lines={lines} setLines={setLines} characters={characters} setCharacters={setCharacters} />
        ) : (
          <AdvancedScriptEditor data={initialData} lines={lines} setLines={setLines} characters={characters} setCharacters={setCharacters} />
        )}
      </div>

      <AiPromptBar value={aiPrompt} onChange={setAiPrompt} onSend={handleAiSend} />
    </div>
  );
};

interface ImageViewerProps {
  initialImage: StoryboardImage;
  allImages?: StoryboardImage[];
  onClose: () => void;
  onUpdate: (newImg: StoryboardImage) => void;
  onAiEditRequest?: (prompt: string, imageId: string, onSuccess?: () => void) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ initialImage, allImages = [], onClose, onUpdate, onAiEditRequest }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionImages, setSessionImages] = useState<StoryboardImage[]>(allImages.length ? allImages : [initialImage]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentImg = sessionImages[currentIdx];

  useEffect(() => {
    const idx = sessionImages.findIndex((img) => img.id === initialImage.id);
    if (idx !== -1) setCurrentIdx(idx);
  }, [initialImage.id, sessionImages]);

  const handleMagicEdit = () => {
    if (!prompt.trim()) return;
    if (onAiEditRequest) {
      setIsLoading(true);
      onAiEditRequest(prompt, currentImg.id, onClose);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const updated = { ...currentImg, description: prompt, src: `https://picsum.photos/400/600?random=${Date.now()}` };
      const next = [...sessionImages];
      next[currentIdx] = updated;
      setSessionImages(next);
      onUpdate(updated);
      setIsLoading(false);
      setPrompt('');
    }, 1200);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#111111]">
      <div className="flex items-center justify-between p-4 pt-6">
        <div className="w-8" />
        <span className="text-[15px] font-medium text-white">分镜画面</span>
        <button onClick={onClose} className="text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="flex flex-col items-center">
          <div className="relative mt-2 aspect-[9/16] w-[250px] overflow-hidden rounded-xl bg-[#1A1A1A]">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                <RefreshCw className="animate-spin text-white" />
              </div>
            )}
            <img src={currentImg.src} alt="preview" className="h-full w-full object-cover" />
            {currentImg.subtitle && (
              <div className="absolute bottom-5 left-3 right-3 text-center text-[12px] text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,.8)' }}>
                {currentImg.subtitle}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 px-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded bg-[#7BA4F5] px-2 py-1 text-[11px] text-white">提示词</div>
            <p className="text-[13px] leading-6 text-gray-300">{currentImg.prompt}</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded bg-[#F5C882] px-2 py-1 text-[11px] text-black">字幕</div>
            <p className="text-[13px] leading-6 text-gray-300">{currentImg.subtitle}</p>
          </div>
        </div>

        {sessionImages.length > 1 && (
          <div className="mt-6 flex justify-center gap-3 px-4">
            {sessionImages.map((img, idx) => (
              <button key={img.id} onClick={() => setCurrentIdx(idx)} className={`h-16 w-11 overflow-hidden rounded-lg border ${currentIdx === idx ? 'border-[#7BA4F5]' : 'border-transparent opacity-50'}`}>
                <img src={img.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-5 pt-3">
        <div className="flex items-center gap-2 rounded-xl border border-[#333333] bg-[#222222] px-3 py-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMagicEdit()}
            placeholder="告诉AI调整分镜画面效果、字幕文案..."
            className="h-8 flex-1 bg-transparent text-[13px] text-gray-300 placeholder:text-gray-500 focus:outline-none"
          />
          <button onClick={handleMagicEdit} className={`flex h-7 w-7 items-center justify-center rounded-full ${prompt.trim() ? 'bg-[#5A8A5A] text-black' : 'bg-[#333333] text-gray-500'}`}>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface CharacterViewerProps {
  initialCharacter: CharacterDesign;
  allCharacters?: CharacterDesign[];
  onClose: () => void;
  onUpdate: (newChar: CharacterDesign) => void;
  onAiEditRequest?: (prompt: string, characterId: string, onSuccess?: () => void) => void;
}

export const CharacterViewer: React.FC<CharacterViewerProps> = ({ initialCharacter, allCharacters = [], onClose, onUpdate, onAiEditRequest }) => {
  const [prompt, setPrompt] = useState('');
  const [chars, setChars] = useState<CharacterDesign[]>(allCharacters.length ? allCharacters : [initialCharacter]);
  const [index, setIndex] = useState(0);
  const current = chars[index];

  const handleAiEdit = () => {
    if (!prompt.trim()) return;
    if (onAiEditRequest) {
      onAiEditRequest(prompt, current.id, onClose);
      return;
    }
    const updated = { ...current, description: `${current.description} ${prompt}` };
    const next = [...chars];
    next[index] = updated;
    setChars(next);
    onUpdate(updated);
    setPrompt('');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#111111]">
      <div className="flex items-center justify-between p-4 pt-6">
        <button onClick={() => setIndex((prev) => Math.max(0, prev - 1))} className="text-white/70">
          <ChevronLeft size={22} />
        </button>
        <span className="text-[15px] font-medium text-white">角色设定</span>
        <button onClick={onClose} className="text-white">
          <X size={24} />
        </button>
      </div>
      <div className="flex-1 px-5">
        <div className="mx-auto aspect-[3/4] w-[220px] overflow-hidden rounded-2xl bg-[#2A2A2A]">
          <img src={current.imageUrl} alt={current.name} className="h-full w-full object-cover" />
        </div>
        <div className="mt-4 text-center text-[18px] font-medium text-white">{current.name}</div>
        <p className="mt-2 text-center text-[14px] leading-7 text-gray-300">{current.description}</p>
      </div>
      <div className="px-4 pb-5 pt-3">
        <div className="flex items-center gap-2 rounded-xl border border-[#333333] bg-[#222222] px-3 py-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiEdit()}
            placeholder="输入AI指令调整角色设定"
            className="h-8 flex-1 bg-transparent text-[13px] text-gray-300 placeholder:text-gray-500 focus:outline-none"
          />
          <button onClick={handleAiEdit} className={`flex h-7 w-7 items-center justify-center rounded-full ${prompt.trim() ? 'bg-[#5A8A5A] text-black' : 'bg-[#333333] text-gray-500'}`}>
            <ArrowUp size={16} />
          </button>
        </div>
        {chars.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4 text-white/70">
            <button onClick={() => setIndex((prev) => Math.max(0, prev - 1))}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setIndex((prev) => Math.min(chars.length - 1, prev + 1))}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface VideoPlayerProps {
  thumbnail: string;
  segments?: VideoSegment[];
  onClose: () => void;
  onUpdate: (newSegments: VideoSegment[]) => void;
  onAiEditRequest?: (prompt: string, segmentId: string, onSuccess?: () => void) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ thumbnail, segments = [], onClose, onUpdate, onAiEditRequest }) => {
  const [prompt, setPrompt] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSegment = segments[currentIndex];

  const handleAiEdit = () => {
    if (!prompt.trim() || !currentSegment) return;
    if (onAiEditRequest) {
      onAiEditRequest(prompt, currentSegment.id, onClose);
      return;
    }
    const nextSegments = segments.map((seg) => (seg.id === currentSegment.id ? { ...seg, description: `${seg.description} ${prompt}` } : seg));
    onUpdate(nextSegments);
    setPrompt('');
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#111111]">
      <div className="flex items-center justify-between p-4 pt-6">
        <div className="w-8" />
        <span className="text-[15px] font-medium text-white">视频效果</span>
        <button onClick={onClose} className="text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 px-5">
        <div className="relative mx-auto aspect-[3/4] w-[240px] overflow-hidden rounded-2xl bg-[#2A2A2A]">
          <img src={currentSegment?.thumbnail || thumbnail} alt="video" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white">
              <Play size={22} fill="currentColor" />
            </div>
          </div>
        </div>
        <p className="mt-4 text-[14px] leading-7 text-gray-300">{currentSegment?.description}</p>
      </div>

      <div className="px-4 pb-5 pt-3">
        <div className="mb-3 flex items-center justify-between text-white/70">
          <button onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setCurrentIndex((prev) => Math.min(segments.length - 1, prev + 1))}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#333333] bg-[#222222] px-3 py-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiEdit()}
            placeholder="输入AI指令调整视频片段"
            className="h-8 flex-1 bg-transparent text-[13px] text-gray-300 placeholder:text-gray-500 focus:outline-none"
          />
          <button onClick={handleAiEdit} className={`flex h-7 w-7 items-center justify-center rounded-full ${prompt.trim() ? 'bg-[#5A8A5A] text-black' : 'bg-[#333333] text-gray-500'}`}>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
