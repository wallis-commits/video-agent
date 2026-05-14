import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface TextToVideoPageProps {
  onBack: () => void;
}

type VideoTab = 'long' | 'short';
type RatioOption = '9:16' | '16:9' | '1:1';
type ResolutionOption = '540P' | '720P' | '1080P';
type DropdownType = 'ratio' | 'resolution' | null;

const RATIO_OPTIONS: RatioOption[] = ['9:16', '16:9', '1:1'];
const RESOLUTION_OPTIONS: ResolutionOption[] = ['540P', '720P', '1080P'];

const RatioPreviewIcon: React.FC<{ ratio: RatioOption }> = ({ ratio }) => {
  const sizeClass =
    ratio === '9:16'
      ? 'h-[15px] w-[9px]'
      : ratio === '16:9'
        ? 'h-[9px] w-[15px]'
        : 'h-[13px] w-[13px]';

  return <span className={`inline-block rounded-[2px] border border-white ${sizeClass}`} />;
};

const DropdownList = <T extends string>({
  options,
  value,
  onSelect,
}: {
  options: T[];
  value: T;
  onSelect: (value: T) => void;
}) => (
  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#2E2E35] shadow-[0_18px_36px_rgba(0,0,0,0.32)]">
    {options.map((option, index) => {
      const selected = option === value;
      return (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`flex min-h-[46px] w-full items-center justify-between px-4 text-left text-[14px] ${
            index === 0 ? '' : 'border-t border-white/8'
          } ${selected ? 'bg-white/8 text-white' : 'text-[#D7D7DD]'}`}
        >
          <span>{option}</span>
          {selected && <span className="text-[12px] text-[#B9FF63]">已选</span>}
        </button>
      );
    })}
  </div>
);

export const TextToVideoPage: React.FC<TextToVideoPageProps> = ({ onBack }) => {
  const [videoTab, setVideoTab] = useState<VideoTab>('short');
  const [prompt, setPrompt] = useState('');
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const [duration, setDuration] = useState(5);
  const [ratio, setRatio] = useState<RatioOption>('9:16');
  const [resolution, setResolution] = useState<ResolutionOption>('540P');
  const [fastMode, setFastMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('[data-dropdown-root="text-to-video"]')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const cost = fastMode ? 2 : 1;
  const canGenerate = prompt.trim().length > 0;

  const beginGenerate = () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1400);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#101011] text-white">
      <div className="relative z-10 px-[15px] pb-3 pt-11">
        <div className="relative flex h-8 items-center justify-center">
          <button
            onClick={onBack}
            aria-label="返回"
            className="absolute left-0 flex h-8 w-8 items-center justify-center border border-dashed border-white/55 text-white/85"
          >
            <ChevronLeft size={19} />
          </button>

          <div className="rounded-full bg-[#242426] p-1">
            <div className="flex h-[30px] items-center">
              <button
                onClick={() => setVideoTab('long')}
                className={`h-[26px] rounded-full px-[21px] text-[12px] transition-colors ${
                  videoTab === 'long' ? 'bg-white text-[#1E1E20]' : 'text-[#A7A7AD]'
                }`}
              >
                长视频
              </button>
              <button
                onClick={() => setVideoTab('short')}
                className={`h-[26px] rounded-full px-[21px] text-[12px] transition-colors ${
                  videoTab === 'short' ? 'bg-white text-[#1E1E20]' : 'text-[#A7A7AD]'
                }`}
              >
                短视频
              </button>
            </div>
          </div>
        </div>

        <div className="relative mt-5 h-[283px] rounded-md bg-[#2B2B32] px-3 pb-4 pt-3 shadow-[0_14px_28px_rgba(0,0,0,0.22)]">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 30000))}
            placeholder="描述你想要的视频画面～"
            className="h-[210px] w-full resize-none bg-transparent text-[14px] leading-7 text-white outline-none placeholder:text-[#8A8A92]"
          />
          <div className="absolute bottom-4 left-3 right-3 flex items-end justify-between">
            <span className="text-[14px] text-[#A9A9B2]">
              <span className="text-white">{prompt.length}</span>/30000
            </span>
            {prompt.length > 0 && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                aria-label="清空输入"
                className="flex h-7 w-7 items-center justify-center border border-dashed border-white/55 text-white/80"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 px-[20px] pt-1">
        <div className="space-y-[27px]">
          <section>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#D8D8DD]">时长设置</span>
              <span className="text-[14px] text-white">{duration}S</span>
            </div>
            <input
              type="range"
              min={3}
              max={16}
              step={1}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-3 h-4 w-full cursor-pointer accent-[#8FFF6A]"
            />
          </section>

          <section className="relative" data-dropdown-root="text-to-video">
            <button
              onClick={() => setOpenDropdown((prev) => (prev === 'ratio' ? null : 'ratio'))}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-[14px] text-[#D8D8DD]">视频比例</span>
              <span className="flex items-center gap-2 text-[14px] text-white">
                <RatioPreviewIcon ratio={ratio} />
                {ratio}
                <ChevronRight size={18} />
              </span>
            </button>
            {openDropdown === 'ratio' && (
              <DropdownList
                options={RATIO_OPTIONS}
                value={ratio}
                onSelect={(value) => {
                  setRatio(value);
                  setOpenDropdown(null);
                }}
              />
            )}
          </section>

          <section className="relative" data-dropdown-root="text-to-video">
            <button
              onClick={() => setOpenDropdown((prev) => (prev === 'resolution' ? null : 'resolution'))}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-[14px] text-[#D8D8DD]">分辨率</span>
              <span className="flex items-center gap-2 text-[14px] text-white">
                {resolution}
                <ChevronRight size={18} />
              </span>
            </button>
            {openDropdown === 'resolution' && (
              <DropdownList
                options={RESOLUTION_OPTIONS}
                value={resolution}
                onSelect={(value) => {
                  setResolution(value);
                  setOpenDropdown(null);
                }}
              />
            )}
          </section>

          <section className="flex items-center justify-between">
            <span className="text-[14px] text-[#D8D8DD]">快速模式（生成快，价格翻倍）</span>
            <button
              type="button"
              onClick={() => setFastMode((prev) => !prev)}
              aria-pressed={fastMode}
              className={`relative h-5 w-10 rounded-full border transition-colors ${
                fastMode ? 'border-[#8FFF6A] bg-[#2F4B2E]' : 'border-white/70 bg-transparent'
              }`}
            >
              <span
                className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white transition-all ${
                  fastMode ? 'left-[21px]' : 'left-[3px]'
                }`}
              />
            </button>
          </section>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#101011] px-[15px] pb-10 pt-5">
        <button
          onClick={beginGenerate}
          disabled={!canGenerate || isGenerating}
          className={`flex h-[53px] w-full items-center justify-center gap-2 rounded-full text-[17px] font-medium transition-colors ${
            !canGenerate || isGenerating
              ? 'bg-[#4E6340] text-[#171A14]/70'
              : 'bg-gradient-to-r from-[#718A3F] to-[#43805F] text-[#151A13]'
          }`}
        >
          <span>{isGenerating ? '生成中...' : '开始生成'}</span>
          <span className="inline-block h-3.5 w-3.5 rotate-45 rounded-[3px] bg-[#9B6B38]" />
          <span className="text-[14px]">{cost}</span>
        </button>
      </div>
    </div>
  );
};
