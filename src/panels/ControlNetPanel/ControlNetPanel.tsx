import { Group, Stack, Item, SelectField, SwitchField, Text, Alert, useRUIForm } from "@osuresearch/ui";
import { SliderField } from "@/components/SliderField";

export function ControlNetPanel() {
  const { register, watch } = useRUIForm({
    defaultValues: {
      // TODO: Grab from Redux
      model: 'scribble_xdog',
      weight: 0.7,
      start: 0,
      end: 0.15,
      xdogThreshold: 32,
    }
  })

  const useXDoG = watch('model') === 'scribble_xdog';

  return (
    <Stack align="stretch" p="md">
      <Group align="center" justify="apart" w="100%">
        <SelectField
          aria-label="Model" w="300px"
          {...register('model')}
        >
        <Item key="canny">Canny</Item>
          <Item key="mlsd">MLSD</Item>
          <Item key="scribble_xdog">Scribble XDoG</Item>
        </SelectField>
      </Group>

      <SliderField label="Weight"
        step={0.05}
        minValue={0}
        maxValue={2}
        {...register('weight')}
      />

      <Group align="stretch">
        <SliderField label="Start"
          step={0.01}
          minValue={0}
          maxValue={1}
          {...register('start')}
        />

        <SliderField label="End"
          step={0.01}
          minValue={0}
          maxValue={1}
          {...register('end')}
        />
      </Group>

      {useXDoG &&
        <SliderField label="XDoG threshold"
          description="Control the level of detail for the EXtended Difference of Gaussian edge detection algorithm"
          minValue={1}
          maxValue={64}
          {...register('xdogThreshold')}
        />
      }
    </Stack>
  )
}
