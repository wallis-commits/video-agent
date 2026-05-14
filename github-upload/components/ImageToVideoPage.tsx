import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImagePlus, X } from 'lucide-react';

interface ImageToVideoPageProps {
  onBack: () => void;
}

type ResolutionOption = '540P' | '720P' | '1080P';
type DropdownType = 'resolution' | null;

const RESOLUTION_OPTIONS: ResolutionOption[] = ['540P', '720P', '1080P'];

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

export const ImageToVideoPage: React.FC<ImageToVideoPageProps> = ({ onBack }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [prompt, setPrompt] = useState('');
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const [duration, setDuration] = useState(5);
  const [resolution, setResolution] = useState<ResolutionOption>('540P');
  const [fastMode, setFastMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const canGenerate = Boolean(imagePreview);
  const cost = fastMode ? 2 : 1;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('[data-dropdown-root="image-to-video"]')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImagePreview((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return URL.createObjectURL(file);
    });
  };

  const clearImage = () => {
    setImagePreview((prev) => {
      if (prev?.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const beginGenerate = () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1400);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#101011] text-white">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="relative z-10 px-[15px] pb-3 pt-11">
        <div className="relative flex h-8 items-center">
          <button
            onClick={onBack}
            aria-label="返回"
            className="flex h-8 w-8 items-center justify-center border border-dashed border-white/55 text-white/85"
          >
            <ChevronLeft size={19} />
          </button>
        </div>

        <div className="relative mt-5 h-[340px] rounded-md bg-[#2B2B32] px-4 pb-4 pt-4 shadow-[0_14px_28px_rgba(0,0,0,0.22)]">
          <div className="relative z-10 mb-4">
            {imagePreview ? (
              <div className="relative h-[88px] w-[88px] overflow-hidden rounded-md border border-white/10 bg-[#1B1B20]">
                <img src={imagePreview} alt="上传图片预览" className="h-full w-full object-cover" />
                <div className="absolute right-1.5 top-1.5 flex gap-1.5">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="rounded-full bg-black/55 px-2 py-1 text-[10px] text-white backdrop-blur-sm"
                  >
                    更换
                  </button>
                  <button
                    type="button"
                    onClick={clearImage}
                    aria-label="删除图片"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={openFilePicker}
                aria-label="上传图片"
                className="flex h-[88px] w-[88px] items-center justify-center border border-dashed border-white/40 text-white/85"
              >
                <div className="relative">
                  <ImagePlus size={34} fill="currentColor" strokeWidth={1.8} />
                  <span className="absolute -right-1 -top-2 text-[20px] font-semibold leading-none">+</span>
                </div>
              </button>
            )}
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 3000))}
            placeholder="结合图片，输入创意描述"
            className="relative z-10 h-[170px] w-full resize-none bg-transparent text-[14px] leading-7 text-white outline-none placeholder:text-[#8A8A92]"
          />

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <span className="text-[14px] text-[#A9A9B2]">
              <span className="text-white">{prompt.length}</span>/3000
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 px-[20px] pt-3">
        <div className="space-y-[29px]">
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

          <section className="relative" data-dropdown-root="image-to-video">
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
          <span>{isGenerating ? '生成中...' : '生成视频'}</span>
          <span className="inline-block h-3.5 w-3.5 rotate-45 rounded-[3px] bg-[#9B6B38]" />
          <span className="text-[14px]">{cost}</span>
        </button>
      </div>
    </div>
  );
};
