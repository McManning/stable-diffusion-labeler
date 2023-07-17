import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Stack, MenuItem } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { Panel } from "@/components/Panel";
import { SelectField } from "@/components/SelectField";
import { SliderField } from "@/components/SliderField";
import { useAppSelector } from "@/hooks";
import { updateControlNet } from "@/features/generator";

export function ControlNetPanel() {
  const controlNet = useAppSelector((s) => s.generator.controlNet);
  const dispatch = useDispatch();

  const methods = useForm<ControlNetSettings>({
    mode: 'all',
    defaultValues: controlNet,
  });

  const changes = methods.watch();

  useEffect(() => {
    dispatch(updateControlNet(changes));
  }, [changes, dispatch]);

  const useXDoG = changes.model === 'scribble_xdog';

  return (
    <FormProvider {...methods}>
      <Panel gap={2}>
        <SelectField name="model" label="Model">
          <MenuItem value="canny">Canny</MenuItem>
          <MenuItem value="mlsd">MLSD</MenuItem>
          <MenuItem value="scribble_xdog">Scribble XDoG</MenuItem>
        </SelectField>

        <SliderField name="weight"
          label="Weight"
          step={0.05}
          min={0}
          max={2}
        />

        <Stack direction="row" gap={4}>
          <SliderField name="start"
            label="Start"
            step={0.01}
            min={0}
            max={1}
          />

          <SliderField name="end"
            label="End"
            step={0.01}
            min={0}
            max={1}
          />
        </Stack>

        {useXDoG &&
          <SliderField name="xdogThreshold"
            label="XDoG threshold"
            description="Control the level of detail for the EXtended Difference of Gaussian edge detection algorithm"
            min={1}
            max={64}
          />
        }
      </Panel>
    </FormProvider>
  )
}
