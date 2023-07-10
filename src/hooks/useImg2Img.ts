import { StableDiffusionSettings } from "../features/settings";
import { useAppSelector } from "."

export function useImg2Img() {
  const settings = useAppSelector<StableDiffusionSettings>((s) => s.settings.integrations);

  return {
    apply() {
      // Let's pretend something happens here and the API is called.
      // Eventually we should get a data URI with image data, and
      // need to replace our current image with that.

      // We should:
      // 1. store the current image as a backup for undo
      // 2. store the current mask as a backup for undo
      // 3. delete the current mask
      // 4. replace the current image's data uri with the img2img result

      // Also during the above: lock down the app and wait for the API response.

      // Might also need to ensure the canvas is square before shipping off.

      alert('ya')
    }
  }
}
