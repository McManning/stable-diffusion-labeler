import { ImageReference } from "@/features/doodle";
import { GeneratorState } from "@/features/generator";
import { Color } from "@osuresearch/ui";
import Konva from "konva";

/**
 * Match category ID to color
 *
 * @see https://danbooru.donmai.us/wiki_pages/help:tags
 */
export function getBooruCategoryColor(category: number): Color {
  return [
    'accent01', // general.. again?
    'accent05', // artist
    'neutral', // general ???
    'accent06', // copyright
    'accent03', // character
    'accent02', // meta
  ][category] as Color;
}

// 0 = ???
// 1 = artist = red
// 2 = general = blue
// 3 = copyright = purple
// 4 = character = green
// 5 = meta = orange

export function getBooruCategoryName(category: number) {
  return [
    'general',
    'artist',
    'general',
    'copyright',
    'character',
    'meta',
  ][category];
}

export function arraysEqual(a: any[], b: any[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

export function searchTags(search: ImageSearchFilter, tags: string[]) {
  const pattern = `.*${search.terms.split(' ').join('.*')}.*`;
  const re = new RegExp(pattern, 'gi');

  return tags.find((tag) => tag.search(re) >= 0);
}

export function isMatch(image: TrainingImage, search: ImageSearchFilter) {
  const hasTagMatches = search.terms.length > 0 && searchTags(search, image.tags) !== undefined;
  const hasUntaggedMatch = search.untagged && image.tags.length < 1;

  return hasUntaggedMatch || hasTagMatches;
}

export function filterBySearch(images: TrainingImage[], search: ImageSearchFilter) {
  return images.filter((img) => isMatch(img, search));
}

export function blendPromptToPositiveTag(prompt: BlendPrompt): string {
  if (prompt.positive && prompt.positive.length > 0 && prompt.weight > 0.001) {
    return prompt.positive.replace('{weight}', prompt.weight.toFixed(2));
  }

  return '';
}

export function blendPromptToNegativeTag(prompt: BlendPrompt): string {
  if (prompt.negative && prompt.negative.length > 0 && prompt.weight > 0.001) {
    return prompt.negative.replace('{weight}', prompt.weight.toFixed(2));
  }

  return '';
}

function getModelForControlNetModule(module: string) {
  // TODO: The module names are hardcoded in ControlNetPanel right now.

  // Ref: http://localhost:7860/controlnet/model_list
  return {
    canny: 'control_v11p_sd15_canny [d14c016b]',
    mlsd: 'control_v11p_sd15_mlsd [aca30ff0]',
    scribble_xdog: 'control_v11p_sd15_scribble [d4ba51ff]',
  }[module];
}

export function createTxt2ImgPayload(
  b64ControlNetImage: string,
  generator: GeneratorState
) {
  const { prompt, sampler, controlNet, blend } = generator;

  // Blend together the blend prompts + user prompts
  const positive = Object.values(blend.prompts)
    .map((p) => blendPromptToPositiveTag(p))
    .filter((p) => p.length)
    .join(', ')
    + prompt.positive;

  const negative = Object.values(blend.prompts)
    .map((p) => blendPromptToNegativeTag(p))
    .filter((p) => p.length)
    .join(', ')
    + prompt.negative;

  return {
    // Prompt
    prompt: positive,
    negative_prompt: negative,

    // Sampling
    width: sampler.width,
    height: sampler.height,

    // Alternatively: DPM++ 2S a Karras
    sampler_name: 'DPM++ 2M Karras',
    seed: -1,
    n_iter: sampler.batchCount,
    batch_size: sampler.batchSize,

    steps: sampler.steps,
    cfg_scale: sampler.cfgScale,

    // Upscaling
    enable_hr: sampler.upscale > 0.001,
    hr_scale: sampler.upscale,
    hr_upscaler: '', // Anime or SuperScale
    hr_sampler_name: '',
    hr_prompt: '', // TODO: Same prompt?
    hr_negative_prompt: '',

    // ControlNet
    // https://github.com/Mikubill/sd-webui-controlnet/wiki/API#web-api
    alwayson_scripts: {
      controlnet: {
        args: [
          {
            // Strip suffix from b64 encoded image
            // TODO: Move this logic elsewhere.
            input_image: b64ControlNetImage.substring('data:image/png;base64,'.length),

            // "module": "canny",
            // "model": "control_v11p_sd15_canny [d14c016b]",

            module: controlNet.model, // Preprocessor
            model: getModelForControlNetModule(controlNet.model), // Conditioning model
            weight: controlNet.weight,
            guidance_start: controlNet.start,
            guidance_end: controlNet.end,
            processor_res: 512, // Base Preprocessor Resolution. Defaults to 64

            threshold_a: controlNet.model === 'scribble_xdog'
              ? controlNet.xdogThreshold
              : -1,

            // // No cropping for resize. Drawing boundaries is the same as the sampler output.
            // resize_mode: 0,
          }
        ]
      }
    }
  }
}

export function getTransform(node: Konva.Node): Transform {
  const { x, y, scaleX, scaleY, skewX, skewY, rotation } = node.getAttrs();
  return {
    x,
    y,
    scaleX,
    scaleY,
    skewX,
    skewY,
    rotation,
  }
}
