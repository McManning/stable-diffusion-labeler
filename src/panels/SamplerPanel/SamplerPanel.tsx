import { Alert, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch, Tooltip, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useDeepCompareEffect } from "react-use";

import { SelectField } from "@/components/SelectField";
import { SliderField } from "@/components/SliderField";
import { Panel } from "@/components/Panel";
import { HumanizedValue } from "@/components/HumanizeValue";
import { updateSampler } from "@/features/generator";
import { useAppSelector } from "@/hooks";
import { ToggleField } from "@/components/ToggleField";

export function SamplerPanel() {
  const sampler = useAppSelector((s) => s.generator.sampler);
  const maxGPUCanvasSize = useAppSelector((s) => s.settings.maxGPUCanvasSize);

  const dispatch = useDispatch();

  const methods = useForm<SamplerSettings>({
    mode: 'all',
    defaultValues: sampler,
  });

  const { register, watch } = methods;

  const settings = watch();
  useDeepCompareEffect(() => {
    dispatch(updateSampler(settings));
  }, [settings]);

  const outWidth = Math.floor(settings.width * settings.upscale * settings.batchSize);
  const outHeight = Math.floor(settings.height * settings.upscale * settings.batchSize);

  const exceedsCUDA = outWidth * outHeight > maxGPUCanvasSize;

  return (
    <FormProvider {...methods}>
      <Panel gap={2}>
        <Stack direction="row" justifyContent="space-between">
          <SelectField name="model" label="Model">
            <MenuItem value="flat2DAnimerge_v20">flat2DAnimerge_v20</MenuItem>
            <MenuItem value="other">Something else</MenuItem>
          </SelectField>

          {/* VAE hot swapping isn't really supported. I just need to fix mine... */}
          {/* <ToggleField name="useVAE" label="Use VAE" /> */}
        </Stack>

        <SliderField label="Sampling steps"
          description="How many times to improve the generated image iteratively"
          name="steps"
          min={1}
          max={150}
        />

        <SliderField label="Cfg scale"
          description="How strongly the image should conform to the prompt, lower values are more creative"
          name="cfgScale"
          min={1}
          max={30}
        />

        {/* <Stack direction="row" gap={4}>
          <SliderField label="Width"
            name="width"
            step={64}
            min={64}
            max={2048}
          />

          <SliderField label="Height"
            name="height"
            step={64}
            min={64}
            max={2048}
          />
        </Stack>

        <Stack direction="row" gap={4}>
          <SliderField label="Count"
            name="batchCount"
            min={1}
            max={100}
          />

          <SliderField label="Concurrency"
            name="batchSize"
            min={1}
            max={8}
          />
        </Stack> */}

        <Typography fontSize="small" my={2}>
          Canvas size is <strong>{settings.width} x {settings.height}</strong> for
          <strong> {watch('batchSize')}</strong> concurrent image(s)
        </Typography>

        <Divider sx={{ marginBottom: 2 }} />

        <SliderField label="Upscale factor"
          name="upscale"
          min={1}
          max={4}
          step={0.05}
        />

        {settings.upscale > 1.001 &&
        <Typography fontSize="small" mt={2}>
          Resize from <strong>{settings.width} x {settings.height}</strong> to
          <strong> {outWidth} x {outHeight}</strong>
        </Typography>
        }

        {exceedsCUDA &&
          <Alert severity="error">
            Total canvas size of <HumanizedValue value={outWidth * outHeight} /> pixels exceeds maximum resolution supported.
            Adjust your concurrency count, upscale factor, and image dimensions to generate a resolution
            under <HumanizedValue value={maxGPUCanvasSize} /> pixels.
          </Alert>
        }
      </Panel>
    </FormProvider>
  )
}
