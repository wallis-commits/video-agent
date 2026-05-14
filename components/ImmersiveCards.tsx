import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Contact,
  Copy,
  Edit3,
  Image as ImageIcon,
  Maximize2,
  Play,
  Wand2,
} from 'lucide-react';
import {
  AudioOption,
  CharacterDesign,
  CostData,
  ScriptData,
  StoryboardImage,
  VideoSegment,
  VideoSettings,
} from '../types';

interface SettingsCardProps {
  onConfirm: (settings: VideoSettings) => void;
  initialValues?: VideoSettings;
  readonly?: boolean;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ onConfirm, initialValues, readonly }) => {
  const [style, setStyle] = useState(initialValues?.style || '3D卡通');
  const [sceneDuration, setSceneDuration] = useState(initialValues?.sceneDuration || '10S');
  const [duration, setDuration] = useState(initialValues?.duration || '<=1min');
  const [ratio, setRatio] = useState(initialValues?.ratio || '9:16');
  const [resolution, setResolution] = useState(initialValues?.resolution || '480P');
  const [openKey, setOpenKey] = useState<string | null>(null);

  const rows = [
    { key: 'style', label: '画面风格', value: style, setter: setStyle, options: ['3D卡通', '写实电影', '动漫风格', '童话绘本', '赛博朋克'] },
    { key: 'sceneDuration', label: '每个分镜时长(S)', value: sceneDuration, setter: setSceneDuration, options: ['5S', '8S', '10S', '12S', '15S'] },
    { key: 'duration', label: '预计总视频时长', value: duration, setter: setDuration, options: ['<30s', '<=1min', '1~2min', '2~3min'] },
    { key: 'ratio', label: '视频比例', value: ratio.replace(':', ' : '), rawValue: ratio, setter: setRatio, options: ['9:16', '16:9', '1:1', '4:3'] },
    { key: 'resolution', label: '分辨率', value: resolution, setter: setResolution, options: ['480P', '720P', '1080P'] },
  ] as const;

  return (
    <div className="w-full max-w-[96%] rounded-[22px] border border-white/5 bg-[#1F1F20] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
      <p className="mb-4 text-[14px] leading-7 text-[#E8E8E8]">请确认视频的基础信息，这将帮助我们更好地理解你的需求。</p>

      <div className="space-y-3">
        {rows.map((row) => {
          const isOpen = openKey === row.key;
          const selectedValue = 'rawValue' in row ? row.rawValue : row.value;
          return (
            <div key={row.key} className="relative">
              <button
                onClick={() => {
                  if (!readonly) {
                    setOpenKey(isOpen ? null : row.key);
                  }
                }}
                className="flex w-full items-center justify-between rounded-[14px] bg-[#343435] px-4 py-4 text-left"
              >
                <span className="text-[14px] text-[#D4D4D4]">{row.label}</span>
                <span className="flex items-center gap-2 text-[14px] text-white">
                  {row.value}
                  {!readonly && (isOpen ? <ChevronUp size={16} className="text-[#8D8E95]" /> : <ChevronDown size={16} className="text-[#8D8E95]" />)}
                  {readonly && <ChevronDown size={16} className="text-[#8D8E95]" />}
                </span>
              </button>

              {!readonly && isOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[16px] border border-white/10 bg-[#2C2D31] shadow-2xl">
                  {row.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        row.setter(option);
                        setOpenKey(null);
                      }}
                      className={`flex w-full items-center justify-between px-4 py-3 text-[14px] ${
                        selectedValue === option ? 'bg-white/10 text-white' : 'text-[#C4C5CB] hover:bg-white/5'
                      }`}
                    >
                      <span>{row.key === 'ratio' ? option.replace(':', ' : ') : option}</span>
                      {selectedValue === option && <CheckCircle2 size={14} className="text-[#B7FF68]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onConfirm({ style, sceneDuration, duration, ratio, resolution })}
        className="mt-5 w-full rounded-full bg-white py-3.5 text-[15px] font-medium text-[#2A2A2E] transition-colors hover:bg-white/90"
      >
        确定，进行下一步
      </button>
    </div>
  );
};

interface ScriptCardProps {
  data: ScriptData;
  onEdit: () => void;
}

export const ScriptCard: React.FC<ScriptCardProps> = ({ data, onEdit }) => {
  const [expanded, setExpanded] = useState(false);
  const showSubtitle = data.modelMode === 'basic';

  const handleCopy = () => {
    const content = [
      '分镜脚本',
      ...data.characters.map((item) => `${item.name}：${item.description}`),
      ...data.lines.map((line, index) => `画面${index + 1}：${line.visual}${showSubtitle && line.subtitle ? `\n字幕：${line.subtitle}` : ''}`),
    ].join('\n');
    navigator.clipboard?.writeText(content);
  };

  return (
    <div className="w-full max-w-[96%] rounded-[22px] bg-[#232323] px-4 pb-3 pt-4 shadow-[0_16px_36px_rgba(0,0,0,0.28)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 size={16} className="text-[#D790FF]" />
          <span className="text-[15px] font-semibold text-white">分镜脚本</span>
        </div>
        <div className="flex items-center gap-3 text-white">
          <button onClick={onEdit} className="transition-opacity hover:opacity-80">
            <Edit3 size={17} />
          </button>
          <button onClick={handleCopy} className="transition-opacity hover:opacity-80">
            <Copy size={17} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="mb-3 text-[15px] font-semibold text-white">角色介绍({data.characters.length})</h4>
        <div className="rounded-[10px] bg-[#343434] px-4 py-3">
          <div className="space-y-4">
            {data.characters.map((char) => (
              <p key={char.id} className="text-[14px] leading-6 text-[#F0F0F0]">
                <span className="font-medium text-[#B7FF68]">{char.name}：</span>
                {char.description}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className={`relative transition-all duration-300 ${expanded ? 'max-h-[960px]' : 'max-h-[270px] overflow-hidden'}`}>
        <h4 className="mb-3 text-[15px] font-semibold text-white">分镜内容({data.lines.length})</h4>
        <div className="space-y-3">
          {data.lines.map((line, index) => (
            <div key={line.id} className="flex gap-3">
              {showSubtitle && <div className="pt-3 text-[22px] leading-none text-[#E3E3E6]">{index + 1}</div>}
              <div className="flex-1 rounded-[10px] bg-[#343434] px-4 py-3">
                <div className="flex items-start gap-2 text-[14px] leading-6 text-[#F0F0F0]">
                  <span className="shrink-0 font-medium text-[#9BE369]">{showSubtitle ? '画面' : `画面${index + 1}`}</span>
                  <p>{line.visual}</p>
                </div>
                {showSubtitle && line.subtitle && (
                  <div className="mt-3 flex items-start gap-2 text-[14px] leading-6 text-[#F0F0F0]">
                    <span className="shrink-0 font-medium text-[#78B5FF]">字幕</span>
                    <p>{line.subtitle}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {!expanded && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#232323] to-transparent" />}
      </div>

      <button onClick={() => setExpanded((prev) => !prev)} className="flex w-full justify-center pt-3 text-[#DBDBDE] hover:text-white">
        {expanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
      </button>
    </div>
  );
};

interface CharacterSelectionCardProps {
  characters: CharacterDesign[];
  onConfirm: () => void;
  onCharacterClick: (char: CharacterDesign) => void;
}

export const CharacterSelectionCard: React.FC<CharacterSelectionCardProps> = ({ characters, onConfirm, onCharacterClick }) => {
  return (
    <div className="w-full max-w-[95%] space-y-3">
      <div className="rounded-[20px] bg-[#2A2A2A] p-4">
        <div className="mb-4 flex items-center gap-2 text-[#E5B859]">
          <Contact size={18} />
          <span className="text-sm font-medium">角色定妆照</span>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {characters.map((char) => (
            <button key={char.id} onClick={() => onCharacterClick(char)} className="w-[140px] shrink-0 text-left">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#3A3A3A]">
                <img src={char.imageUrl} alt={char.name} className="h-full w-full object-cover" />
                <div className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white">
                  <Maximize2 size={12} />
                </div>
              </div>
              <div className="mt-2 text-[13px] font-medium text-white">{char.name}</div>
              <div className="mt-1 line-clamp-2 text-[11px] leading-tight text-gray-400">{char.description}</div>
            </button>
          ))}
        </div>
      </div>
      <button onClick={onConfirm} className="w-full rounded-xl border border-[#A3B87A] py-3 text-sm font-medium text-[#A3B87A] hover:bg-[#A3B87A]/10">
        满意，开始下一步
      </button>
    </div>
  );
};

interface CostCardProps {
  data: CostData;
  onConfirm?: () => void;
  onToggleOffPeak?: () => void;
}

export const CostCard: React.FC<CostCardProps> = ({ data, onToggleOffPeak }) => {
  return (
    <div className="w-full max-w-[96%] rounded-[22px] bg-[#232323] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.28)]">
      <div className="overflow-hidden rounded-[10px] border border-white/8">
        <div className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.8fr] bg-[#2C2C2F] px-4 py-3 text-[13px] text-[#A5A5AB]">
          <span>名称</span>
          <span className="text-center">数量</span>
          <span className="text-center">单价</span>
          <span className="text-right">报价</span>
        </div>
        {data.items.map((item, index) => (
          <div key={index} className="grid grid-cols-[1.4fr_0.7fr_0.7fr_0.8fr] items-center border-t border-white/6 px-4 py-3 text-[14px]">
            <div className="flex items-center gap-2 text-white">
              <span>{item.icon}</span>
              <span>{item.name}</span>
              {item.isFree && <span className="rounded-full bg-[#6D4CFF]/20 px-2 py-0.5 text-[10px] text-[#D6B9FF]">免费</span>}
            </div>
            <span className="text-center text-[#C9C9CE]">{item.quantity}</span>
            <span className="text-center text-[#C9C9CE]">{item.unitPrice}</span>
            <span className="text-right text-[#C9C9CE]">{item.totalPrice}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-white/6 px-4 py-4 text-[15px]">
          <span className="text-[#C8C8CD]">总计</span>
          <span className="font-medium text-white">≈ 💎 {data.total}</span>
        </div>
      </div>

      {data.note && <p className="mt-4 text-[13px] leading-6 text-[#9D9DA4]">{data.note}</p>}
      {data.supportsOffPeak && data.footerTag && (
        <button onClick={onToggleOffPeak} className="mt-3 flex items-center gap-2 text-[13px] text-[#A6F27C]">
          <CheckCircle2 size={16} className={data.offPeakSelected ? 'opacity-100' : 'opacity-40'} />
          <span>{data.footerTag}</span>
        </button>
      )}
    </div>
  );
};

interface GuideCardProps {
  text: string;
  buttonText: string;
  onConfirm: () => void;
}

export const GuideCard: React.FC<GuideCardProps> = ({ text, buttonText, onConfirm }) => {
  return (
    <div className="w-full max-w-[96%] rounded-[22px] bg-[#232323] p-5 shadow-[0_16px_36px_rgba(0,0,0,0.28)]">
      <p className="text-[14px] leading-8 text-[#ECECEF]">{text}</p>
      <button onClick={onConfirm} className="mt-5 w-full rounded-full bg-white py-3.5 text-[15px] font-medium text-[#2A2A2E] hover:bg-white/90">
        {buttonText}
      </button>
    </div>
  );
};

interface StoryboardCardProps {
  images: StoryboardImage[];
  onImageClick: (img: StoryboardImage) => void;
  onConfirm: () => void;
  onEdit?: () => void;
}

export const StoryboardCard: React.FC<StoryboardCardProps> = ({ images, onImageClick, onConfirm, onEdit }) => {
  return (
    <div className="w-full max-w-[95%] space-y-3">
      <div className="rounded-[20px] bg-[#1F1F25] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <ImageIcon size={16} className="text-[#B388FF]" />
            <span className="text-sm font-medium">分镜画面</span>
          </div>
          {onEdit && (
            <button onClick={onEdit} className="text-gray-400 hover:text-white">
              <Edit3 size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {images.map((img, index) => (
            <button key={img.id} onClick={() => onImageClick(img)} className="w-32 shrink-0">
              <div className="relative aspect-[9/16] overflow-hidden rounded-xl">
                <img src={img.src} alt={img.description} className="h-full w-full object-cover" />
                <div className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded bg-white text-[10px] font-bold text-black">
                  {index + 1}
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-center text-[11px] text-gray-300">{img.description}</p>
            </button>
          ))}
        </div>
      </div>
      <button onClick={onConfirm} className="w-full rounded-xl border border-[#A3B87A] py-3 text-sm font-medium text-[#A3B87A] hover:bg-[#A3B87A]/10">
        满意，开始生成动效视频
      </button>
    </div>
  );
};

interface AudioSelectionCardProps {
  options: AudioOption[];
  onSelect: (id: string) => void;
}

export const AudioSelectionCard: React.FC<AudioSelectionCardProps> = ({ options, onSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentOption = options[currentIndex];

  return (
    <div className="w-full max-w-[90%] rounded-[20px] bg-[#2A2A2A] p-4">
      <p className="mb-4 text-[13px] text-gray-300">为您推荐以下音色：</p>
      <div className="mb-4 rounded-xl bg-[#333333] px-4 py-3 text-[14px] text-white">{currentOption?.name}</div>
      <div className="flex gap-3">
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % options.length)} className="flex-1 rounded-xl border border-[#D4A373]/50 py-2.5 text-[13px] text-[#D4A373]">
          换个音色
        </button>
        <button onClick={() => onSelect(currentOption.id)} className="flex-[1.4] rounded-xl border border-[#A3B87A] py-2.5 text-[13px] text-[#A3B87A]">
          满意，开始生成分镜画面
        </button>
      </div>
    </div>
  );
};

interface VideoCardProps {
  thumbnail: string;
  duration: string;
  segments?: VideoSegment[];
  onEdit: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ segments = [], onEdit }) => {
  return (
    <div className="w-full max-w-[95%] space-y-3">
      <div className="rounded-[20px] bg-[#1F1F25] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <BookOpen size={16} className="text-[#53D8E7]" />
            <span className="text-sm font-medium">分镜视频</span>
          </div>
          <button onClick={onEdit} className="text-gray-400 hover:text-white">
            <Edit3 size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {segments.map((segment) => (
            <button key={segment.id} className="w-32 shrink-0 text-left">
              <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-[#3A3A3A]">
                <img src={segment.thumbnail} alt={segment.description} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white">
                    <Play size={18} fill="currentColor" className="translate-x-[1px]" />
                  </div>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] text-gray-300">{segment.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface FinalVideoCardProps {
  thumbnail: string;
  onEdit: () => void;
  onDownloadComplete?: () => void;
}

export const FinalVideoCard: React.FC<FinalVideoCardProps> = ({ thumbnail, onEdit, onDownloadComplete }) => {
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsGenerating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-[90%] space-y-3">
      <div className="rounded-[20px] bg-[#2A2A2A] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#F5C882]">
            <BookOpen size={16} />
            <span className="text-[14px] font-medium">视频效果</span>
          </div>
          {!isGenerating && (
            <button onClick={onEdit} className="text-[13px] text-gray-400 hover:text-white">
              edit
            </button>
          )}
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#3A3A3A]">
          {isGenerating ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-[#A3B87A]" />
            </div>
          ) : (
            <>
              <img src={thumbnail} alt="video" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white">
                  <Play size={24} fill="currentColor" className="translate-x-[1px]" />
                </div>
              </div>
            </>
          )}
        </div>
        {!isGenerating && (
          <button onClick={onDownloadComplete} className="mt-4 w-full rounded-xl bg-[#3A3A3A] py-2.5 text-[13px] text-white">
            下载
          </button>
        )}
      </div>
    </div>
  );
};
