import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, History, MessageSquare } from 'lucide-react';
import {
  ADVANCED_CHARACTERS,
  ADVANCED_EXAMPLE_CHAT_ID,
  ADVANCED_EXAMPLE_MESSAGES,
  ADVANCED_SCRIPT,
  ADVANCED_STORYBOARD,
  ADJUST_PLACEHOLDER,
  BASIC_AUDIO_OPTIONS,
  BASIC_CHARACTERS,
  BASIC_EXAMPLE_CHAT_ID,
  BASIC_EXAMPLE_MESSAGES,
  BASIC_SCRIPT,
  BASIC_STORYBOARD,
  DEFAULT_CHAT_ID,
  DEFAULT_PLACEHOLDER,
  createGuideData,
  createInitialMessages,
  createQuoteData,
} from './constants';
import { ChatInterface } from './components/ChatInterface';
import { HistorySidebar, ChatHistory } from './components/HistorySidebar';
import { Home } from './components/Home';
import { ImageToVideoPage } from './components/ImageToVideoPage';
import { InputArea } from './components/InputArea';
import { CharacterViewer, ImageViewer, ScriptEditor, VideoPlayer } from './components/Overlays';
import { PurchasePage } from './components/PurchasePage';
import { SimulatedKeyboard } from './components/SimulatedKeyboard';
import { TextToVideoPage } from './components/TextToVideoPage';
import { Transcription } from './components/Transcription';
import { CharacterDesign, ExampleEntry, Message, ModelMode, OverlayState, ScriptData, StoryboardImage, VideoSegment, VideoSettings } from './types';

interface ChatSessionState {
  messages: Message[];
  modelMode: ModelMode;
  inputPlaceholder: string;
  lastPrompt: string;
  videoSettings: VideoSettings | null;
}

const createSession = (
  modelMode: ModelMode = 'advanced',
  options?: {
    showExamples?: boolean;
    messages?: Message[];
    placeholder?: string;
  },
): ChatSessionState => ({
  messages: options?.messages || createInitialMessages(options?.showExamples),
  modelMode,
  inputPlaceholder: options?.placeholder || DEFAULT_PLACEHOLDER,
  lastPrompt: '',
  videoSettings: null,
});

const createScriptFromPrompt = (prompt: string, mode: ModelMode, settings: VideoSettings | null): ScriptData => {
  const template = mode === 'basic' ? BASIC_SCRIPT : ADVANCED_SCRIPT;

  return {
    ...template,
    title: '分镜脚本',
    totalDuration: settings?.duration || template.totalDuration,
    sceneCount: template.lines.length,
    modelMode: mode,
    characters: template.characters.map((char) => ({
      ...char,
      description: `${char.description}${prompt ? ` 重点围绕“${prompt}”展开视觉表现。` : ''}`,
    })),
    lines: template.lines.map((line, index) => ({
      ...line,
      scene: index + 1,
      duration: settings?.sceneDuration || line.duration,
      visual: `${line.visual}${prompt ? ` 画面情绪围绕“${prompt}”进一步强化。` : ''}`,
      subtitle: mode === 'basic' ? line.subtitle : undefined,
      audio: mode === 'basic' ? line.subtitle : `镜头音频节奏跟随第 ${index + 1} 段分镜推进。`,
    })),
  };
};

const createFinalVideoMessage = (thumbnail: string, duration = '<=1min'): Message => ({
  id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  timestamp: Date.now(),
  role: 'agent',
  type: 'final_video_card',
  videoData: {
    thumbnail,
    videoUrl: '#',
    duration,
  },
});

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'chat' | 'purchase' | 'transcription' | 'text_to_video' | 'image_to_video'>('home');
  const [currentChatId, setCurrentChatId] = useState(DEFAULT_CHAT_ID);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const [overlay, setOverlay] = useState<OverlayState>({ type: 'none' });
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [computePoints] = useState(1000);
  const [histories, setHistories] = useState<ChatHistory[]>([
    { id: DEFAULT_CHAT_ID, title: '新对话' },
    { id: BASIC_EXAMPLE_CHAT_ID, title: '基础模型案例', locked: true },
    { id: ADVANCED_EXAMPLE_CHAT_ID, title: '高级模型案例', locked: true },
  ]);
  const [chatSessions, setChatSessions] = useState<Record<string, ChatSessionState>>({
    [DEFAULT_CHAT_ID]: createSession('advanced', { showExamples: true }),
    [BASIC_EXAMPLE_CHAT_ID]: createSession('basic', { messages: BASIC_EXAMPLE_MESSAGES }),
    [ADVANCED_EXAMPLE_CHAT_ID]: createSession('advanced', { messages: ADVANCED_EXAMPLE_MESSAGES }),
  });

  const currentSession = useMemo(() => chatSessions[currentChatId] || createSession('advanced'), [chatSessions, currentChatId]);
  const messages = currentSession.messages;

  const isKeyboardEligibleElement = (target: HTMLElement | null) => {
    if (!target) return false;
    if (target.tagName === 'TEXTAREA') return true;
    if (target.tagName === 'INPUT') {
      const input = target as HTMLInputElement;
      const textLikeTypes = new Set(['', 'text', 'search', 'email', 'url', 'tel', 'password', 'number']);
      return textLikeTypes.has(input.type);
    }
    return false;
  };

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (isKeyboardEligibleElement(target)) {
        setIsKeyboardVisible(true);
        setFocusedElement(target);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (isKeyboardEligibleElement(target)) {
        setTimeout(() => {
          if (!isKeyboardEligibleElement(document.activeElement as HTMLElement | null)) {
            setIsKeyboardVisible(false);
            setFocusedElement(null);
          }
        }, 100);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  const updateCurrentSession = (updater: (session: ChatSessionState) => ChatSessionState) => {
    setChatSessions((prev) => ({
      ...prev,
      [currentChatId]: updater(prev[currentChatId] || createSession('advanced')),
    }));
  };

  const appendMessages = (...newMessages: Message[]) => {
    updateCurrentSession((session) => ({
      ...session,
      messages: [...session.messages, ...newMessages],
    }));
  };

  const makeMessage = (partial: Partial<Message>): Message => ({
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    role: 'agent',
    type: 'text',
    ...partial,
  });

  const emitScriptBundle = (scriptData: ScriptData) => {
    appendMessages(
      makeMessage({ role: 'agent', type: 'script_card', scriptData }),
      makeMessage({
        role: 'agent',
        type: 'quote_card',
        costData: createQuoteData(scriptData.modelMode, scriptData.lines.length, scriptData.characters.length),
      }),
      makeMessage({ role: 'agent', type: 'guide_card', guideData: createGuideData(scriptData.modelMode) }),
    );
    updateCurrentSession((session) => ({
      ...session,
      inputPlaceholder: ADJUST_PLACEHOLDER,
    }));
  };

  const startScriptGeneration = (prompt: string, session: ChatSessionState, overrideSettings?: VideoSettings | null, overrideMode?: ModelMode) => {
    const modelMode = overrideMode || session.modelMode;
    const settings = overrideSettings === undefined ? session.videoSettings : overrideSettings;
    setIsAgentThinking(true);
    const loadingMessage = makeMessage({ role: 'agent', type: 'text', isLoading: true });
    appendMessages(loadingMessage);

    setTimeout(() => {
      updateCurrentSession((current) => ({
        ...current,
        messages: current.messages.filter((item) => item.id !== loadingMessage.id),
      }));
      emitScriptBundle(createScriptFromPrompt(prompt, modelMode, settings));
      setIsAgentThinking(false);
    }, 1200);
  };

  const handleUserMessage = (text: string) => {
    const userMessage = makeMessage({ role: 'user', type: 'text', text });
    appendMessages(userMessage);

    updateCurrentSession((session) => ({
      ...session,
      lastPrompt: text,
      messages: session.messages.filter((item) => item.type !== 'example_entry'),
    }));

    setHistories((prev) =>
      prev.map((item) => (item.id === currentChatId && item.title === '新对话' ? { ...item, title: text.slice(0, 14) + (text.length > 14 ? '...' : '') } : item)),
    );

    const lastCard = [...messages].reverse().find((item) => item.role === 'agent' && item.type !== 'text' && item.type !== 'example_entry');
    if (lastCard?.type === 'script_card' || lastCard?.type === 'guide_card' || lastCard?.type === 'quote_card') {
      startScriptGeneration(text, { ...currentSession, lastPrompt: text });
      return;
    }

    appendMessages(makeMessage({ role: 'agent', type: 'settings_card' }));
  };

  const handleCardClick = (_msgId: string, action: string, data?: any) => {
    if (action === 'open_example_chat') {
      const entry = data as ExampleEntry;
      setCurrentChatId(entry.targetChatId);
      return;
    }

    if (action === 'confirm_settings') {
      const settings = data as VideoSettings;
      updateCurrentSession((session) => ({
        ...session,
        videoSettings: settings,
      }));
      appendMessages(
        makeMessage({
          role: 'user',
          type: 'text',
          text: `已确认设置：${settings.style}，${settings.duration}，${settings.ratio.replace(':', ' : ')}，${settings.resolution}`,
        }),
      );
      startScriptGeneration(currentSession.lastPrompt, { ...currentSession, videoSettings: settings });
      return;
    }

    if (action === 'open_script') {
      setOverlay({ type: 'script_editor', data });
      return;
    }

    if (action === 'confirm_script_guide' || action === 'confirm_cost') {
      appendMessages(
        makeMessage({
          role: 'agent',
          type: 'character_card',
          characterData: currentSession.modelMode === 'basic' ? BASIC_CHARACTERS : ADVANCED_CHARACTERS,
        }),
      );
      return;
    }

    if (action === 'confirm_merge_video') {
      const thumbnail = currentSession.modelMode === 'basic' ? BASIC_CHARACTERS[0].imageUrl : ADVANCED_CHARACTERS[0].imageUrl;
      appendMessages(createFinalVideoMessage(thumbnail, currentSession.videoSettings?.duration || '<=1min'));
      return;
    }

    if (action === 'toggle_off_peak') {
      updateCurrentSession((session) => ({
        ...session,
        messages: session.messages.map((item) => {
          if ((item.type === 'quote_card' || item.type === 'cost_card') && item.costData?.supportsOffPeak) {
            const nextSelected = !item.costData.offPeakSelected;
            const nextItems = item.costData.items.map((costItem) => {
              if (costItem.name !== '视频生成') return costItem;
              const unitPrice = nextSelected ? 20 : 25;
              return {
                ...costItem,
                unitPrice,
                totalPrice: costItem.quantity * unitPrice,
              };
            });
            const total = nextItems.reduce((sum, costItem) => sum + costItem.totalPrice, 0);
            return {
              ...item,
              costData: {
                ...item.costData,
                items: nextItems,
                total,
                offPeakSelected: nextSelected,
              },
            };
          }
          return item;
        }),
      }));
      return;
    }

    if (action === 'confirm_characters') {
      if (currentSession.modelMode === 'basic') {
        appendMessages(makeMessage({ role: 'agent', type: 'audio_selection', audioOptions: BASIC_AUDIO_OPTIONS }));
        return;
      }

      appendMessages(
        makeMessage({
          role: 'agent',
          type: 'video_card',
          videoData: {
            thumbnail: ADVANCED_STORYBOARD[0].src,
            videoUrl: '#',
            duration: currentSession.videoSettings?.duration || '<=1min',
            segments: ADVANCED_STORYBOARD.map((item, index) => ({
              id: `adv-seg-${index}`,
              thumbnail: item.src,
              duration: currentSession.videoSettings?.sceneDuration || ADVANCED_SCRIPT.lines[index]?.duration || '10S',
              description: item.description,
              prompt: item.prompt,
            })),
          },
        }),
        makeMessage({
          role: 'agent',
          type: 'guide_card',
          guideData: createGuideData('advanced', 'merge'),
        }),
      );
      return;
    }

    if (action === 'select_audio') {
      appendMessages(makeMessage({ role: 'agent', type: 'storyboard_card', storyboardData: BASIC_STORYBOARD }));
      return;
    }

    if (action === 'confirm_storyboard') {
      appendMessages(
        makeMessage({
          role: 'agent',
          type: 'video_card',
          videoData: {
            thumbnail: BASIC_STORYBOARD[0].src,
            videoUrl: '#',
            duration: currentSession.videoSettings?.duration || '<=1min',
            segments: BASIC_STORYBOARD.map((item, index) => ({
              id: `basic-seg-${index}`,
              thumbnail: item.src,
              duration: currentSession.videoSettings?.sceneDuration || '5S',
              description: item.description,
              subtitle: item.subtitle,
              prompt: item.prompt,
            })),
          },
        }),
        makeMessage({
          role: 'agent',
          type: 'guide_card',
          guideData: createGuideData('basic', 'merge'),
        }),
      );
      return;
    }

    if (action === 'view_image') {
      setOverlay({ type: 'image_viewer', data });
      return;
    }

    if (action === 'view_character') {
      setOverlay({ type: 'character_viewer', data });
      return;
    }

    if (action === 'play_video') {
      setOverlay({ type: 'video_player', data });
    }
  };

  const handleSwitchChat = (id: string) => {
    setCurrentChatId(id);
  };

  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    setHistories((prev) => [{ id: newId, title: '新对话' }, ...prev]);
    setChatSessions((prev) => ({
      ...prev,
      [newId]: createSession(currentSession.modelMode),
    }));
    setCurrentChatId(newId);
  };

  const handleDeleteChat = (id: string) => {
    if (id === BASIC_EXAMPLE_CHAT_ID || id === ADVANCED_EXAMPLE_CHAT_ID) return;

    const nextHistories = histories.filter((item) => item.id !== id);
    const safeHistories = nextHistories.length > 0 ? nextHistories : [{ id: DEFAULT_CHAT_ID, title: '新对话' }];
    setHistories(safeHistories);
    setChatSessions((prev) => {
      const next = { ...prev };
      delete next[id];
      if (Object.keys(next).length === 0) {
        next[safeHistories[0].id] = createSession('advanced', { showExamples: safeHistories[0].id === DEFAULT_CHAT_ID });
      }
      return next;
    });
    if (currentChatId === id) {
      setCurrentChatId(safeHistories[0].id);
    }
  };

  const handleKeyPress = (key: string) => {
    if (focusedElement && (focusedElement instanceof HTMLInputElement || focusedElement instanceof HTMLTextAreaElement)) {
      const start = focusedElement.selectionStart || 0;
      const end = focusedElement.selectionEnd || 0;
      const value = focusedElement.value;
      const nextValue = value.slice(0, start) + key + value.slice(end);
      const setter =
        focusedElement instanceof HTMLInputElement
          ? Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
          : Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      setter?.call(focusedElement, nextValue);
      focusedElement.dispatchEvent(new Event('input', { bubbles: true }));
      setTimeout(() => {
        focusedElement.setSelectionRange(start + key.length, start + key.length);
        focusedElement.focus();
      }, 0);
    }
  };

  const handleDelete = () => {
    if (focusedElement && (focusedElement instanceof HTMLInputElement || focusedElement instanceof HTMLTextAreaElement)) {
      const start = focusedElement.selectionStart || 0;
      const end = focusedElement.selectionEnd || 0;
      if (start === 0 && end === 0) return;
      const value = focusedElement.value;
      const nextValue = start === end ? value.slice(0, start - 1) + value.slice(end) : value.slice(0, start) + value.slice(end);
      const nextCursor = start === end ? start - 1 : start;
      const setter =
        focusedElement instanceof HTMLInputElement
          ? Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
          : Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      setter?.call(focusedElement, nextValue);
      focusedElement.dispatchEvent(new Event('input', { bubbles: true }));
      setTimeout(() => {
        focusedElement.setSelectionRange(nextCursor, nextCursor);
        focusedElement.focus();
      }, 0);
    }
  };

  const handleSubmit = () => {
    if (!focusedElement) return;
    const form = focusedElement.closest('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else {
      focusedElement.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
        }),
      );
    }
    setIsKeyboardVisible(false);
    focusedElement.blur();
  };

  const handleStartChatFromHome = (initialPrompt?: string) => {
    setCurrentView('chat');
    setCurrentChatId(DEFAULT_CHAT_ID);
    if (initialPrompt) {
      setTimeout(() => handleUserMessage(initialPrompt), 300);
    }
  };

  const handleScriptSave = (newData: ScriptData) => {
    setOverlay({ type: 'none' });
    updateCurrentSession((session) => ({
      ...session,
      messages: session.messages.map((item) => {
        if (item.type === 'script_card' && item.scriptData) {
          return { ...item, scriptData: newData };
        }
        return item;
      }),
    }));
  };

  const handleAiScriptModification = (prompt: string, _currentScript: ScriptData, onSuccess?: () => void) => {
    onSuccess?.();
    setOverlay({ type: 'none' });
    appendMessages(makeMessage({ role: 'user', type: 'text', text: prompt }));
    updateCurrentSession((session) => ({
      ...session,
      lastPrompt: prompt,
    }));
    startScriptGeneration(prompt, { ...currentSession, lastPrompt: prompt });
  };

  const handleImageUpdate = (_updatedImg: StoryboardImage) => {};
  const handleCharacterUpdate = (_updatedChar: CharacterDesign) => {};
  const handleVideoUpdate = (_newSegments: VideoSegment[]) => {};
  const handleAiImageModification = (_prompt: string, _imageId: string, onSuccess?: () => void) => onSuccess?.();
  const handleAiCharacterModification = (_prompt: string, _characterId: string, onSuccess?: () => void) => onSuccess?.();
  const handleAiVideoModification = (_prompt: string, _segmentId: string, onSuccess?: () => void) => onSuccess?.();

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden text-gray-100">
      <div className="relative h-full w-full overflow-hidden border-gray-900 bg-black/40 shadow-2xl backdrop-blur-md sm:h-[844px] sm:max-h-[95vh] sm:w-[390px] sm:rounded-[40px] sm:border-[8px]">
        <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col overflow-hidden" style={{ bottom: isKeyboardVisible ? '260px' : '0px' }}>
          {currentView === 'home' ? (
            <Home
              credits={computePoints}
              onStartChat={handleStartChatFromHome}
              onOpenTextToVideo={() => setCurrentView('text_to_video')}
              onOpenImageToVideo={() => setCurrentView('image_to_video')}
              onPurchaseClick={() => setCurrentView('purchase')}
              onNavigate={(view) => setCurrentView(view as any)}
            />
          ) : currentView === 'purchase' ? (
            <PurchasePage onBack={() => setCurrentView('home')} />
          ) : currentView === 'transcription' ? (
            <Transcription onNavigate={(view) => setCurrentView(view as any)} />
          ) : currentView === 'text_to_video' ? (
            <TextToVideoPage onBack={() => setCurrentView('home')} />
          ) : currentView === 'image_to_video' ? (
            <ImageToVideoPage onBack={() => setCurrentView('home')} />
          ) : (
            <>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
              <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-36 bg-gradient-to-b from-black via-black/90 to-transparent" />

              <header className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between p-4 pt-6">
                <button onClick={() => setCurrentView('home')} className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-white/30 text-white/70 backdrop-blur-md hover:bg-white/5 hover:text-white">
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-white/30 text-white/70 backdrop-blur-md hover:bg-white/5 hover:text-white">
                    <MessageSquare size={18} />
                  </button>
                  <button onClick={() => setIsHistoryOpen(true)} className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-white/30 text-white/70 backdrop-blur-md hover:bg-white/5 hover:text-white">
                    <History size={20} />
                  </button>
                </div>
              </header>

              <ChatInterface messages={messages} onCardClick={handleCardClick} />

              <InputArea
                onSendMessage={handleUserMessage}
                disabled={isAgentThinking}
                modelMode={currentSession.modelMode}
                onModelModeChange={(mode) => updateCurrentSession((session) => ({ ...session, modelMode: mode }))}
                placeholder={currentSession.inputPlaceholder}
              />

              <HistorySidebar
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                histories={histories}
                currentChatId={currentChatId}
                onSelect={handleSwitchChat}
                onNewChat={handleNewChat}
                onDelete={handleDeleteChat}
              />

              {overlay.type === 'script_editor' && (
                <ScriptEditor
                  initialData={overlay.data}
                  onClose={() => setOverlay({ type: 'none' })}
                  onConfirm={handleScriptSave}
                  onAiEditRequest={(prompt, onSuccess) => handleAiScriptModification(prompt, overlay.data, onSuccess)}
                />
              )}

              {overlay.type === 'image_viewer' && (
                <ImageViewer
                  initialImage={overlay.data.initialImage}
                  allImages={overlay.data.allImages}
                  onClose={() => setOverlay({ type: 'none' })}
                  onUpdate={handleImageUpdate}
                  onAiEditRequest={(prompt, imageId, onSuccess) => handleAiImageModification(prompt, imageId, onSuccess)}
                />
              )}

              {overlay.type === 'character_viewer' && (
                <CharacterViewer
                  initialCharacter={overlay.data.initialCharacter}
                  allCharacters={overlay.data.allCharacters}
                  onClose={() => setOverlay({ type: 'none' })}
                  onUpdate={handleCharacterUpdate}
                  onAiEditRequest={(prompt, characterId, onSuccess) => handleAiCharacterModification(prompt, characterId, onSuccess)}
                />
              )}

              {overlay.type === 'video_player' && (
                <VideoPlayer
                  thumbnail={overlay.data.thumbnail}
                  segments={overlay.data.segments}
                  onClose={() => setOverlay({ type: 'none' })}
                  onUpdate={handleVideoUpdate}
                  onAiEditRequest={(prompt, segmentId, onSuccess) => handleAiVideoModification(prompt, segmentId, onSuccess)}
                />
              )}
            </>
          )}
        </div>

        <SimulatedKeyboard
          isVisible={isKeyboardVisible}
          onClose={() => {
            setIsKeyboardVisible(false);
            focusedElement?.blur();
          }}
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
