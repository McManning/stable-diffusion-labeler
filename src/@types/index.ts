type ImageIdentifier = number;

type BooruTag = {
  /**
   * Tag IDs are used for uniquely identifying tags
   */
  id: string;
  label: string;
  value: string;
  count?: string;
  category?: number;
};

/** Mapping of category to tag(s) */
type GlobalTags = Record<string, string[]>;

/** Rules for searching for images */
type ImageSearchFilter = {
  terms: string;
  regex: boolean;
  untagged?: boolean;
};

/** Rules for applying replacements to images */
type ImageReplaceFilter = {
  terms: string;
};

type TrainingImage = {
  /** Unique identifier. Required for sorting and filtering */
  id: string;

  /** File name */
  name: string;

  /** Labeling tags */
  tags: string[];
};

type WorkspaceFolder = {
  path: string;
};

type Workspace = {
  /** Unique workspace identifier */
  id: string;

  name: string;
  path?: string;
  folders: WorkspaceFolder[];
  images: TrainingImage[];
};

type Point = {
  x: number;
  y: number;
};

type Region = {
  id: number;
  color: string;
  points: Point[];
};

type Crop = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;

  /** Source data URI of the crop, if cached */
  dataUri?: string;

  fixedSize?: boolean;
};

type Label = {
  id: number;
  text?: string;
  keepRatio?: boolean;
  isBoxCut?: boolean;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * An operation on one or more images that can be undo/redo'd
 */
type Operation = {
  type: 'delete' | 'tag' | '';
  image: TrainingImage[];

  /** Previous state before the operation. Depends on operation type */
  prev: any;

  /** Next state after the operation. Depends on operation type */
  next: any;
};

type SamplerSettings = {
  useVAE: boolean;
  width: number;
  height: number;
  steps: number;
  cfgScale: number;
  model: string;
  upscale: number;
  batchCount: number;
  batchSize: number;
};

type ControlNetSettings = {
  model: string;
  weight: number;
  start: number;
  end: number;
  xdogThreshold?: number;
};

type BlendPrompt = {
  label: string;
  weight: number;
  help?: string;
  positive?: string;
  negative?: string;
};

type PromptSettings = {
  positive?: string;
  negative?: string;
};

/**
 * Other networks to blend into the results
 */
type BlendSettings = {
  prompts: Record<string, BlendPrompt>;
  // TODO: textual inversions, normalizers (FastNegativeV2), etc.
};

/**
 * A template that defines a suite of settings for sampling / ControlNet / etc
 * for a particular use case. E.g. character design, environment design, prop sheets.
 */
type GeneratorTemplate = {
  /**
   * Template name. E.g. "Character Design", "Prop Sheet"
   */
  name: string;

  prompt: PromptSettings;
  sampler: SamplerSettings;
  controlNet: ControlNetSettings;
  blend: BlendSettings;
};

type IntegrationSettings = {
  // TODO: RunPod, Drive, and other things?

  /** Stable Diffusion Web UI API */
  sdapi: string;

  /** Booru tags API */
  booruApi: string;
};

type GeneratedImage = {
  id: string;
  src: string;

  /**
   * Metadata blob that comes from Stable Diffusion WebUI
   * for a generated image. Typically stringified JSON
   */
  info: string;

  type: 'preprocessed' | 'txt2img';
};

type InProgressImage = {
  id: string;
  src: string;
  info: string;
  progress: number;
  eta: number;
};

/**
 * Representation of a Konva node transform.
 *
 * This exists because we don't have a `Node.setTransform(Konva.Transform)`
 * that correctly applies a global transform.
 */
type Transform = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  rotation: number;
};

type DoodleLayer = {
  id: string;
  visible: boolean;
  opacity: number;
  konvaLayerId: string;
};

type ImageReference = {
  id: string;
  filename: string;
  dataUri: string;
  layerId: string;

  hidden?: boolean;

  // x: number
  // y: number
  // width: number
  // height: number

  naturalWidth: number;
  naturalHeight: number;
};

type ImageSearchResult = {
  /** Image hit */
  image: TrainingImage;

  /**
   * Tags in this image that match the search terms
   */
  tags: {
    match: string;
    replace?: string;
  }[];
};

type ContextMenuOption = {
  label: React.ReactNode;
  accelerator?: string;
  icon?: string;
  action: (state: ContextMenuState) => void;
};

type ContextMenuState = {
  position: Point;
  context: string;
  data?: any;

  options: Array<ContextMenuOption | 'divider'>;
};
