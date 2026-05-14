import { AudioOption, CharacterDesign, CostData, ExampleEntry, Message, ScriptData, StoryboardImage, VideoSettings } from './types';

export const INITIAL_CHIPS = ['#童话故事', '#30秒', '#3D卡通', '#剧情向', '#温馨结尾'];

export const VIDEO_AGENT_WELCOME = '嗨！今天想制作什么类型的视频？';
export const DEFAULT_PLACEHOLDER = '直接描述你想要的视频画面~';
export const ADJUST_PLACEHOLDER = '你想做哪些调整？';

export const DEFAULT_CHAT_ID = 'chat-1';
export const ADVANCED_EXAMPLE_CHAT_ID = 'example-advanced';
export const BASIC_EXAMPLE_CHAT_ID = 'example-basic';

export const BASIC_EXAMPLE_SETTINGS: VideoSettings = {
  style: '3D卡通',
  sceneDuration: '5S',
  duration: '<=1min',
  ratio: '9:16',
  resolution: '480P',
};

export const ADVANCED_EXAMPLE_SETTINGS: VideoSettings = {
  style: '3D卡通',
  sceneDuration: '10S',
  duration: '<=1min',
  ratio: '9:16',
  resolution: '540P',
};

export const EXAMPLE_ENTRIES: ExampleEntry[] = [
  {
    id: 'basic-example',
    title: '基础模型案例',
    description: '成本更低，分步生成',
    tags: ['#先出分镜图', '#单独配音'],
    imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    targetChatId: BASIC_EXAMPLE_CHAT_ID,
    modelMode: 'basic',
  },
  {
    id: 'advanced-example',
    title: '高级模型案例',
    description: '音画一体直出，效果更好',
    tags: ['#带配音/BGM', '#角色更稳定'],
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    targetChatId: ADVANCED_EXAMPLE_CHAT_ID,
    modelMode: 'advanced',
  },
];

export const ADVANCED_CHARACTERS: CharacterDesign[] = [
  {
    id: 'adv-char-1',
    name: '赛博厨神',
    description: '黑红长袍，机械义肢，眼神冷静克制，角色设定统一稳定。',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'adv-char-2',
    name: '全息食客',
    description: '半透明数据投影，冷色光边缘，作为对手戏角色增强冲突感。',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
  },
];

export const BASIC_CHARACTERS: CharacterDesign[] = [
  {
    id: 'basic-char-1',
    name: '赛博厨神',
    description: '黑红长袍，机械义肢，角色设定明确，便于后续分镜图生成。',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'basic-char-2',
    name: '全息食客',
    description: '半透明虚拟来客，画面层次清晰，便于先出静态分镜画面。',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
  },
];

export const ADVANCED_SCRIPT: ScriptData = {
  title: '分镜脚本',
  totalDuration: '<=1min',
  sceneCount: 3,
  modelMode: 'advanced',
  characters: [
    {
      id: 'adv-script-char-1',
      name: '赛博厨神',
      description: '冷静强势的主角厨师，黑红服饰与机械义肢形成鲜明视觉记忆点。',
    },
    {
      id: 'adv-script-char-2',
      name: '全息食客',
      description: '挑衅式提问者，负责引出剧情冲突，并与主角形成高反差对话。',
    },
  ],
  lines: [
    {
      id: 'adv-line-1',
      scene: 1,
      duration: '15S',
      visual: '雨夜赛博街区，赛博厨神站在霓虹灯下回头，镜头从背后推近到半身特写。',
      audio: '台词：你确定……是你在控制我？环境音带有低频电子脉冲与细雨声。',
    },
    {
      id: 'adv-line-2',
      scene: 2,
      duration: '12S',
      visual: '镜头切到全息食客，虚拟面部在故障闪烁中露出惊讶神情，主角抬手触发机械光效。',
      audio: '台词跟随角色口型同步推进，背景加入紧张氛围 BGM 提升压迫感。',
    },
    {
      id: 'adv-line-3',
      scene: 3,
      duration: '10S',
      visual: '两人对峙的广角镜头缓慢后拉，霓虹反射在积水地面上，画面以悬疑氛围收束。',
      audio: 'BGM 收紧节奏并在结尾留下悬念尾音，强化剧情反转感。',
    },
  ],
};

export const BASIC_SCRIPT: ScriptData = {
  title: '分镜脚本',
  totalDuration: '<=1min',
  sceneCount: 2,
  modelMode: 'basic',
  characters: [
    {
      id: 'basic-script-char-1',
      name: '赛博厨神',
      description: '黑红服装与冷感妆容保持统一，便于后续分镜图持续复用角色设定。',
    },
    {
      id: 'basic-script-char-2',
      name: '全息食客',
      description: '作为次要角色辅助剧情推进，画面以静态冲突感和字幕节奏为主。',
    },
  ],
  lines: [
    {
      id: 'basic-line-1',
      scene: 1,
      duration: '5S',
      visual: '赛博厨神在雨夜街头停步回头，霓虹灯在雨水地面上形成冷暖反射。',
      subtitle: '她穿成了恶毒女配，却先对系统露出冷笑。',
    },
    {
      id: 'basic-line-2',
      scene: 2,
      duration: '5S',
      visual: '全息食客靠近，镜头切到两人对峙的中景，画面停留在悬疑氛围中。',
      subtitle: '“你确定……是你在控制我？”',
    },
  ],
};

export const ADVANCED_STORYBOARD: StoryboardImage[] = [
  {
    id: 'adv-board-1',
    src: ADVANCED_CHARACTERS[0].imageUrl,
    description: '角色确认后直接进入动态视频生成，镜头保留同一人设与光影质感。',
    prompt: 'cyberpunk female chef in rain, cinematic close-up, neon reflections',
  },
  {
    id: 'adv-board-2',
    src: ADVANCED_CHARACTERS[1].imageUrl,
    description: '全息食客以数据故障感出场，增强剧情冲突与悬疑感。',
    prompt: 'hologram diner, glitch effect, rainy neon street',
  },
  {
    id: 'adv-board-3',
    src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    description: '雨夜对峙的分镜动态效果已生成，可继续合成导出完整成片。',
    prompt: 'cinematic confrontation in cyberpunk alley, puddle reflections',
  },
];

export const BASIC_STORYBOARD: StoryboardImage[] = [
  {
    id: 'basic-board-1',
    src: BASIC_CHARACTERS[0].imageUrl,
    description: '先生成分镜静帧，确认角色与场景是否符合预期。',
    prompt: 'cyberpunk female chef, rainy street, static storyboard frame',
    subtitle: '她穿成了恶毒女配，却先对系统露出冷笑。',
  },
  {
    id: 'basic-board-2',
    src: BASIC_CHARACTERS[1].imageUrl,
    description: '分镜图确认后，再用图生视频补充动态效果。',
    prompt: 'hologram diner, static storyboard frame, moody lighting',
    subtitle: '“你确定……是你在控制我？”',
  },
  {
    id: 'basic-board-3',
    src: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    description: '分镜图已转为动效镜头，可继续合成完整视频。',
    prompt: 'cyber alley storyboard frame, subtle motion setup',
    subtitle: '雨夜中，故事停在最危险的一秒。',
  },
];

export const BASIC_AUDIO_OPTIONS: AudioOption[] = [
  {
    id: 'voice-1',
    name: '冷感女声',
    description: '适合悬疑和剧情类短片，语速平稳，压迫感更强。',
    previewUrl: '#',
    selected: true,
  },
  {
    id: 'voice-2',
    name: '清冷旁白',
    description: '更偏故事解说感，适合字幕较多的分步生成流程。',
    previewUrl: '#',
  },
];

export const createWelcomeMessage = (): Message => ({
  id: 'welcome-message',
  role: 'agent',
  type: 'text',
  text: VIDEO_AGENT_WELCOME,
  timestamp: Date.now(),
});

export const createExampleEntryMessage = (): Message => ({
  id: 'example-entry-message',
  role: 'agent',
  type: 'example_entry',
  exampleEntries: EXAMPLE_ENTRIES,
  timestamp: Date.now(),
});

export const createInitialMessages = (showExamples = false): Message[] => {
  const messages = [createWelcomeMessage()];
  if (showExamples) {
    messages.push(createExampleEntryMessage());
  }
  return messages;
};

export const createGuideData = (mode: 'advanced' | 'basic', stage: 'script' | 'merge' = 'script') => {
  if (stage === 'merge') {
    return {
      text: '分镜视频生成好了，您满意的话可直接合成导出完整视频。',
      buttonText: '满意，开始合成&导出',
      action: 'confirm_merge_video',
    };
  }

  return {
    text:
      mode === 'advanced'
        ? '上面是根据您的需求草拟的情节脚本和生成报价。高级模型会在角色确认后，直接生成带配音和 BGM 的分镜视频。'
        : '上面是根据您的需求草拟的情节脚本和生成报价。基础模型会先生成分镜图和配音，再进入视频生成流程，整体成本更低。',
    buttonText: '满意，开始下一步角色设计',
    action: 'confirm_script_guide',
  };
};

export const createQuoteData = (mode: 'advanced' | 'basic', lineCount: number, characterCount: number): CostData => {
  if (mode === 'advanced') {
    const videoUnitPrice = 25;
    const videoQuantity = lineCount * 4;
    return {
      items: [
        { name: '编剧', icon: '🪄', isFree: true, quantity: 1, unitPrice: 0, totalPrice: 0 },
        { name: '角色设计师', icon: '🎭', quantity: characterCount, unitPrice: 14, totalPrice: characterCount * 14 },
        { name: '视频生成', icon: '🎬', quantity: videoQuantity, unitPrice: videoUnitPrice, totalPrice: videoQuantity * videoUnitPrice },
      ],
      total: characterCount * 14 + videoQuantity * videoUnitPrice,
      note: '修改或重新生成将按对应步骤重新计费，最终价格根据生成数量而定。',
      footerTag: '错峰模式（价格更低，生成较慢）',
      supportsOffPeak: true,
      offPeakSelected: true,
    };
  }

  const imageQuantity = lineCount * 4;
  const videoQuantity = lineCount * 4;
  return {
    items: [
      { name: '编剧', icon: '🪄', isFree: true, quantity: 1, unitPrice: 0, totalPrice: 0 },
      { name: '角色设计师', icon: '🎭', quantity: characterCount, unitPrice: 14, totalPrice: characterCount * 14 },
      { name: '分镜师', icon: '🖼️', quantity: imageQuantity, unitPrice: 2, totalPrice: imageQuantity * 2 },
      { name: '视频生成', icon: '🤖', quantity: videoQuantity, unitPrice: 15, totalPrice: videoQuantity * 15 },
    ],
    total: characterCount * 14 + imageQuantity * 2 + videoQuantity * 15,
    note: '基础模型不包含 BGM，配音通过系统音色单独生成，整体成本更低。',
    supportsOffPeak: false,
  };
};

const createUserText = (id: string, text: string): Message => ({
  id,
  role: 'user',
  type: 'text',
  text,
  timestamp: Date.now(),
});

const createAgentText = (id: string, text: string): Message => ({
  id,
  role: 'agent',
  type: 'text',
  text,
  timestamp: Date.now(),
});

const createReadonlySettingsCard = (id: string, settings: VideoSettings): Message => ({
  id,
  role: 'agent',
  type: 'settings_card',
  settingsData: settings,
  readonly: true,
  timestamp: Date.now(),
});

const createFinalVideoMessage = (id: string, thumbnail: string): Message => ({
  id,
  role: 'agent',
  type: 'final_video_card',
  videoData: {
    thumbnail,
    videoUrl: '#',
    duration: '<=1min',
  },
  timestamp: Date.now(),
});

export const ADVANCED_EXAMPLE_MESSAGES: Message[] = [
  createAgentText('adv-tip', '这是高级模型案例：角色确认后，可直接生成带配音和 BGM 的分镜视频。'),
  createUserText('adv-user-prompt', 'AI漫剧：她穿越成了一名恶毒女配，系统让她按剧情陷害女主，否则就会彻底消失。可她却笑了，对系统说：“你确定……是你在控制我？”'),
  createReadonlySettingsCard('adv-settings-card', ADVANCED_EXAMPLE_SETTINGS),
  createUserText('adv-settings-confirm', '已确认设置：3D卡通，<=1min，9 : 16，540P'),
  {
    id: 'adv-script-card',
    role: 'agent',
    type: 'script_card',
    scriptData: ADVANCED_SCRIPT,
    timestamp: Date.now(),
  },
  {
    id: 'adv-quote-card',
    role: 'agent',
    type: 'quote_card',
    costData: createQuoteData('advanced', ADVANCED_SCRIPT.lines.length, ADVANCED_SCRIPT.characters.length),
    timestamp: Date.now(),
  },
  {
    id: 'adv-guide-card',
    role: 'agent',
    type: 'guide_card',
    guideData: createGuideData('advanced'),
    timestamp: Date.now(),
  },
  createUserText('adv-user-script-confirm', '满意，开始下一步角色设计'),
  {
    id: 'adv-character-card',
    role: 'agent',
    type: 'character_card',
    characterData: ADVANCED_CHARACTERS,
    timestamp: Date.now(),
  },
  createUserText('adv-user-character-confirm', '满意，开始生成动效视频'),
  {
    id: 'adv-video-card',
    role: 'agent',
    type: 'video_card',
    videoData: {
      thumbnail: ADVANCED_CHARACTERS[0].imageUrl,
      videoUrl: '#',
      duration: '<=1min',
      segments: ADVANCED_STORYBOARD.map((item, index) => ({
        id: `adv-seg-${index + 1}`,
        thumbnail: item.src,
        duration: ['15S', '12S', '10S'][index] || '10S',
        description: item.description,
        prompt: item.prompt,
      })),
    },
    timestamp: Date.now(),
  },
  {
    id: 'adv-merge-guide',
    role: 'agent',
    type: 'guide_card',
    guideData: createGuideData('advanced', 'merge'),
    timestamp: Date.now(),
  },
  createUserText('adv-user-merge-confirm', '满意，开始合成&导出'),
  createFinalVideoMessage('adv-final-video', ADVANCED_CHARACTERS[0].imageUrl),
];

export const BASIC_EXAMPLE_MESSAGES: Message[] = [
  createAgentText('basic-tip', '这是基础模型案例：先生成分镜图和配音，再合成视频，整体成本更低。'),
  createUserText('basic-user-prompt', 'AI漫剧：她穿越成了一名恶毒女配，系统让她按剧情陷害女主，否则就会彻底消失。可她却笑了，对系统说：“你确定……是你在控制我？”'),
  createReadonlySettingsCard('basic-settings-card', BASIC_EXAMPLE_SETTINGS),
  createUserText('basic-settings-confirm', '已确认设置：3D卡通，<=1min，9 : 16，480P'),
  {
    id: 'basic-script-card',
    role: 'agent',
    type: 'script_card',
    scriptData: BASIC_SCRIPT,
    timestamp: Date.now(),
  },
  {
    id: 'basic-quote-card',
    role: 'agent',
    type: 'quote_card',
    costData: createQuoteData('basic', BASIC_SCRIPT.lines.length, BASIC_SCRIPT.characters.length),
    timestamp: Date.now(),
  },
  {
    id: 'basic-guide-card',
    role: 'agent',
    type: 'guide_card',
    guideData: createGuideData('basic'),
    timestamp: Date.now(),
  },
  createUserText('basic-user-script-confirm', '满意，开始下一步角色设计'),
  {
    id: 'basic-character-card',
    role: 'agent',
    type: 'character_card',
    characterData: BASIC_CHARACTERS,
    timestamp: Date.now(),
  },
  createUserText('basic-user-character-confirm', '满意，开始挑选配音音色'),
  {
    id: 'basic-audio-card',
    role: 'agent',
    type: 'audio_selection',
    audioOptions: BASIC_AUDIO_OPTIONS,
    timestamp: Date.now(),
  },
  createUserText('basic-user-audio-confirm', '满意，开始生成分镜画面'),
  {
    id: 'basic-storyboard-card',
    role: 'agent',
    type: 'storyboard_card',
    storyboardData: BASIC_STORYBOARD,
    timestamp: Date.now(),
  },
  createUserText('basic-user-storyboard-confirm', '满意，开始生成动效视频'),
  {
    id: 'basic-video-card',
    role: 'agent',
    type: 'video_card',
    videoData: {
      thumbnail: BASIC_CHARACTERS[0].imageUrl,
      videoUrl: '#',
      duration: '<=1min',
      segments: BASIC_STORYBOARD.map((item, index) => ({
        id: `basic-seg-${index + 1}`,
        thumbnail: item.src,
        duration: '5S',
        description: item.description,
        subtitle: BASIC_SCRIPT.lines[index]?.subtitle,
        prompt: item.prompt,
      })),
    },
    timestamp: Date.now(),
  },
  {
    id: 'basic-merge-guide',
    role: 'agent',
    type: 'guide_card',
    guideData: createGuideData('basic', 'merge'),
    timestamp: Date.now(),
  },
  createUserText('basic-user-merge-confirm', '满意，开始合成&导出'),
  createFinalVideoMessage('basic-final-video', BASIC_CHARACTERS[0].imageUrl),
];
