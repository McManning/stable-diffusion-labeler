import { Group, Stack, Item, SelectField, SwitchField, Text, Alert, useRUIForm } from "@osuresearch/ui";
import { SliderField } from "@/components/SliderField";

export function LoRAPanel() {
  // const { register, watch } = useRUIForm({
  //   defaultValues: {
  //     // TODO: Grab from Redux.
  //     // This list is dynamic.
  //     ATv4: 0.6,
  //     Steampunk: 0,
  //     Cogpunk: 0,
  //     Tentacles: 0,
  //   }
  // })

  const options = [
    {
      label: 'ATv4',
      weight: 0.6,
      prompt: '<lora:ATv4:{weight}>',
    },
    {
      label: 'Steampunk',
      weight: 0,
      prompt: '<lyco:PunkBundleAI:{weight}> steampunkai'
    },
    {
      label: 'Dieselpunk',
      weight: 0,
      prompt: '<lyco:PunkBundleAI:{weight}> dieselpunkai'
    },
    {
      label: 'Trypophobia',
      weight: 0,
      prompt: '<lyco:HorrorBundlev4:{weight}> TrypophobiaAI'
    },
  ]

  return (
    <Stack align="stretch" p="md">
      {options.map((opt) =>
        <SliderField
          key={opt.label}
          name={opt.label}
          label={opt.label}
          step={0.05}
          minValue={0}
          maxValue={1.5}
          value={opt.weight}
        />
      )}
    </Stack>
  )
}
