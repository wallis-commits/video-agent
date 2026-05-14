// Message Roles and Types
export type Role = 'user' | 'agent';
export type MessageType =
  | 'text'
  | 'example_entry'
  | 'character_card'
  | 'script_card'
  | 'storyboard_card'
  | 'audio_selection'
  | 'video_card'
  | 'final_video_card'
  | 'system_notification'
  | 'cost_card'
  | 'settings_card'
  | 'payment_guide'
  | 'quote_card'
  | 'guide_card';
export type ModelMode = 'basic' | 'advanced';

export interface ExampleEntry {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  targetChatId: string;
  modelMode: ModelMode;
}

// Data Structures for Payload
export interface CostItem {
  name: string;
  icon: string;
  isFree?: boolean;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CostData {
  items: CostItem[];
  total: number;
  note?: string;
  footerTag?: string;
  supportsOffPeak?: boolean;
  offPeakSelected?: boolean;
}

export interface CharacterDesign {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface ScriptLine {
  id: string;
  scene: number;
  duration: string;
  visual: string;
  audio?: string;
  subtitle?: string;
}

export interface ScriptData {
  title: string;
  totalDuration: string;
  sceneCount: number;
  modelMode: ModelMode;
  characters: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  lines: ScriptLine[];
}

export interface VideoSettings {
  style: string;
  sceneDuration: string;
  duration: string;
  ratio: string;
  resolution: string;
}

export interface StoryboardImage {
  id: string;
  src: string;
  prompt: string;
  description: string;
  subtitle?: string;
}

export interface AudioOption {
  id: string;
  name: string;
  description: string;
  previewUrl: string; // Mock URL
  selected?: boolean;
}

export interface VideoSegment {
  id: string;
  thumbnail: string;
  duration: string;
  description: string;
  subtitle?: string;
  prompt?: string;
}

// Main Message Interface
export interface Message {
  id: string;
  role: Role;
  type: MessageType;
  text?: string;
  thoughtProcess?: string; // Model thinking process log
  timestamp: number;
  isLoading?: boolean;
  settingsData?: VideoSettings;
  readonly?: boolean;
  
  // Specific Payloads
  costData?: CostData;
  exampleEntries?: ExampleEntry[];
  characterData?: CharacterDesign[];
  scriptData?: ScriptData;
  storyboardData?: StoryboardImage[];
  audioOptions?: AudioOption[];
  guideData?: {
    text: string;
    buttonText: string;
    action?: string;
  };
  videoData?: {
    thumbnail: string;
    videoUrl: string;
    duration: string;
    segments?: VideoSegment[];
  };
}

// Overlay State Management
export type OverlayType = 'none' | 'script_editor' | 'image_viewer' | 'video_player' | 'character_viewer';

export interface OverlayState {
  type: OverlayType;
  data?: any; // Context data for the overlay
}
