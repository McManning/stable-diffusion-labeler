import { Alert, Button, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch, Tooltip, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useDeepCompareEffect } from "react-use";

import { SelectField } from "@/components/SelectField";
import { SliderField } from "@/components/SliderField";
import { Panel } from "@/components/Panel";
import { HumanizedValue } from "@/components/HumanizeValue";
import { updateSampler } from "@/features/generator";
import { useAppSelector } from "@/hooks";

export function GeneratorSettings() {
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
      <Stack fontSize="small" width={250} p={2} gap={2}>
        <Stack direction="row" gap={2}>
          <SliderField label="Count"
            name="batchCount"
            min={1}
            max={100}
          />

          {/* <SliderField label="Concurrency"
            name="batchSize"
            min={1}
            max={8}
          /> */}
        </Stack>

        <Button>Clear images</Button>


      </Stack>
    </FormProvider>
  )
}
