import { SelectField } from "@/components/SelectField";
import { SliderField } from "@/components/SliderField";
import { Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

export function ControlNetPanel() {
  const methods = useForm({
    defaultValues: {
      // TODO: Grab from Redux
      model: 'scribble_xdog',
      weight: 0.7,
      start: 0,
      end: 0.15,
      xdogThreshold: 32,
    }
  });

  const { watch } = methods;

  const useXDoG = watch('model') === 'scribble_xdog';

  return (
    <FormProvider {...methods}>
      <Stack padding={2} gap={1}>

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
      </Stack>
    </FormProvider>
  )
}
