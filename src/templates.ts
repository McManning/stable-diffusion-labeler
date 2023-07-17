
/** Generator templates */

export const DEFAULT_TEMPLATE: GeneratorTemplate = {
  name: 'Default',
  prompt: {
    positive: '',
    negative: '',
  },
  sampler: {
    useVAE: false,
    width: 768,
    height: 768,
    steps: 20,
    cfgScale: 7,
    model: 'flat2DAnimerge_v20',
    upscale: 1.0,
    batchCount: 4,
    batchSize: 1,
  },
  controlNet: {
    model: 'scribble_xdog',
    weight: 1.0,
    start: 0,
    end: 0.7,
    xdogThreshold: 32,
  },
  blend: {
    prompts: {
      FastNegativeV2: {
        label: 'Common negative',
        help: 'Frequently used negatives using FastNegativeV2 for fixing hands, bad composition, etc',
        weight: 1,
        negative: '(FastNegativeV2:{weight})'
      },
      ATv4: {
        label: 'Adventure Time (v4)',
        help: 'Come along with me for plagiarism!',
        weight: 0.6,
        positive: '<lora:ATv4:{weight}>',
      },
      Steampunk: {
        label: 'Steampunk',
        weight: 0,
        positive: '<lyco:PunkBundleAI:{weight}> steampunkai',
      },
      Dieselpunk: {
        label: 'Dieselpunk',
        weight: 0,
        positive: '<lyco:PunkBundleAI:{weight}> dieselpunkai',
      },
      Tentacles: {
        label: 'Tentacles',
        weight: 0,
        positive: '<lyco:HorrorBundlev4:{weight}> TrypophobiaAI',
      },
      Trypophobia: {
        label: 'Trypophobia',
        weight: 0,
        positive: '<lyco:HorrorBundlev4:{weight}> TrypophobiaAI',
      },
    }
  }
};

const CHARACTER_DESIGN: GeneratorTemplate = {
  ...DEFAULT_TEMPLATE,
  name: 'Character Design',
};

const ENVIRONMENT_DESIGN: GeneratorTemplate = {
  ...DEFAULT_TEMPLATE,
  name: 'Environment Design',
};

const PROP_SHEET: GeneratorTemplate = {
  ...DEFAULT_TEMPLATE,
  name: 'Prop Sheet',
};

export const TEMPLATES = [
  CHARACTER_DESIGN,
  ENVIRONMENT_DESIGN,
  PROP_SHEET,
];
