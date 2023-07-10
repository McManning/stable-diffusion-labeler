import { SliderField } from "@/components/SliderField";
import { Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

export function SamplerPanel() {
  const methods = useForm({
    defaultValues: {
      // TODO: Grab from Redux
      useVAE: false,
      width: 768,
      height: 768,
      steps: 20,
      model: 'flat2DAnimerge_v20',
      upscale: 1.0,
      batchCount: 4,
      batchSize: 1,
    }
  })

  const { register, watch } = methods;

  const width = watch('width');
  const height = watch('height');
  const upscale = watch('upscale');

  const outWidth = Math.floor(width * upscale);
  const outHeight = Math.floor(height * upscale);

  return (
    <FormProvider {...methods}>
      <Stack padding={2} gap={1}>
        {/* <Stack>
          <SelectField aria-label="Model" w="300px"
            {...register('model')}
          >
            <Item key="flat2DAnimerge_v20">flat2DAnimerge_v20</Item>
            <Item key="other">Something else</Item>
          </SelectField>

          <SwitchField label="Use VAE" {...register('useVAE')} />
        </Stack> */}

        <Stack direction="row" justifyContent="space-between">
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="model-label">Model</InputLabel>
            <Select
              labelId="model-label"
              id="model"
              label="Model"
            >
              <MenuItem value="flat2DAnimerge_v20">flat2DAnimerge_v20</MenuItem>
              <MenuItem value="other">Something else</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Use VAE"
            labelPlacement="start"
          />

        </Stack>

        <SliderField label="Sampling steps"
          name="steps"
          min={1}
          max={150}
        />

        <Stack direction="row" gap={4}>
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
        </Stack>

        <Typography fontSize="small" my={2}>
          Canvas size is <strong>{width} x {height}</strong> for
          <strong> {watch('batchSize')}</strong> concurrent image(s)
        </Typography>

        <Divider sx={{ marginBottom: 2 }} />

        <SliderField label="Upscale factor"
          name="upscale"
          min={1}
          max={4}
          step={0.05}
        />

        <Typography fontSize="small" mt={2}>
          Resize from <strong>{width} x {height}</strong> to
          <strong> {outWidth} x {outHeight}</strong>
        </Typography>

        {/* <Alert
          variant="critical"
          title="Concurrent size exceeds maximum resolution of 1500x1500"
        /> */}
      </Stack>
    </FormProvider>
  )
}
