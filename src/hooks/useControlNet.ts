import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "@/hooks";
import { useDoodleStage } from "@/hooks/useDoodleStage";
import { createTxt2ImgPayload } from "@/utils";
import { addImages, setError, setGenerating, setProgressImage } from "@/features/generator";

type ControlImageFactory = (width: number, height: number) => Promise<string>;

export function useControlNet() {
  const generator = useAppSelector((s) => s.generator);
  const settings = useAppSelector((s) => s.settings.integrations);
  const dispatch = useDispatch();

  const { sampler, generating, error, progressImage } = generator;

  useEffect(() => {
    let active = false;
    let prevImage = '';

    if (!generating) {
      return;
    }

    const intervalHandle = setInterval(() => {
      // Block concurrent requests
      if (active) {
        return;
      }

      active = true;

      const url = `${settings.sdapi}/progress?skip_current_image=false`;
      fetch(url, {
        headers: {
          Accept: 'application/json'
        }
      })
      .then((res) => res.json())
      .then((data) => {
        dispatch(setProgressImage({
          id: data.state.job_timestamp,
          src: `data:image/png;base64,${data.current_image}`,
          info: `Sampling step ${data.state.sampling_step} / ${data.state.sampling_steps}`,
          progress: data.progress,
          eta: data.eta_relative,
        }));
      })
      .finally(() => {
        active = false;
      });

    }, 200);

    return () => {
      clearInterval(intervalHandle);
    }
  }, [generating]);

  return {
    loading: generating,
    error,
    progress: progressImage?.progress ?? 0,
    eta: progressImage?.eta ?? 0,

    /**
     * Execute txt2img with ControlNet guidance.
     *
     * This will also start the background process to monitor for progress updates.
     *
     * @param imageFactory
     */
    generate: async (imageFactory: ControlImageFactory) => {
      const url = `${settings.sdapi}/txt2img`;

      dispatch(setProgressImage(undefined));
      dispatch(setGenerating(true));

      try {
        const b64img = await imageFactory(sampler.width, sampler.height);

        // // TEMP: Just store.
        // dispatch(addImages([{
        //   id: Date.now().toString(),
        //   src: b64img,
        // }]));

        const res = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            createTxt2ImgPayload(b64img, generator)
          )
        });

        const data = await res.json();

        if (Array.isArray(data.images)) {
          const images = data.images.map((b64: string, idx: number) => ({
            id: Date.now().toString(),
            src: `data:image/png;base64,${b64}`,
            info: data.info,
            // ControlNet preprocessed images follow the generated images.
            // This cannot be turned off for now. See: https://github.com/Mikubill/sd-webui-controlnet/issues/1432
            type: idx >= sampler.batchCount * sampler.batchSize ? 'preprocessed' : 'txt2img'
          } as GeneratedImage));

          dispatch(addImages(images));
        }
      }
      catch (e) {
        console.error(e);
        dispatch(setError('TODO: Message. Check console for now'));
      }
      finally {
        dispatch(setGenerating(false));
      }
    }
  }
}
