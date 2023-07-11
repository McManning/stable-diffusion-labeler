import { SliderField } from "@/components/SliderField";
import { Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

export function LoRAPanel() {
  const methods = useForm({
    defaultValues: {
      // TODO: Grab from Redux.
      // This list is dynamic.
      ATv4: 0.6,
      Steampunk: 0,
      Cogpunk: 0,
      Tentacles: 0,
      Trypophobia: 0,
    }
  })

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
      label: 'Tentacles',
      weight: 0,
      prompt: '<lyco:HorrorBundlev4:{weight}> TrypophobiaAI'
    },
    {
      label: 'Trypophobia',
      weight: 0,
      prompt: '<lyco:HorrorBundlev4:{weight}> TrypophobiaAI'
    },
  ]

  return (
    <FormProvider {...methods}>
      <Stack padding={2} gap={1}>
        {options.map((opt) =>
          <SliderField
            key={opt.label}
            name={opt.label}
            label={opt.label}
            step={0.05}
            min={0}
            max={1.5}
          />
        )}
      </Stack>
    </FormProvider>
  )
}
