import { SliderField } from "@/components/SliderField";
import { Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

export function LoRAPanel() {
  const methods = useForm<LoRASettings>({
    defaultValues: {
      lora: {
        // TODO: Grab from Redux.
        // This list is dynamic.
        ATv4: {
          label: 'Adventure Time (v4)',
          weight: 0.6,
          prompt: '<lora:ATv4:{weight}>',
        },
        Steampunk: {
          label: 'Steampunk',
          weight: 0,
          prompt: '<lyco:PunkBundleAI:{weight}> steampunkai',
        },
        Dieselpunk: {
          label: 'Dieselpunk',
          weight: 0,
          prompt: '<lyco:PunkBundleAI:{weight}> dieselpunkai',
        },
        Tentacles: {
          label: 'Tentacles',
          weight: 0,
          prompt: '<lyco:HorrorBundlev4:{weight}> TrypophobiaAI',
        },
        Trypophobia: {
          label: 'Trypophobia',
          weight: 0,
          prompt: '<lyco:HorrorBundlev4:{weight}> TrypophobiaAI',
        },
      }
    }
  })

  const lora = methods.watch('lora');

  return (
    <FormProvider {...methods}>
      <Stack padding={2} gap={1}>
        {Object.keys(lora).map((name) =>
          <SliderField
            key={name}
            name={`lora.${name}.weight`}
            label={lora[name].label}
            step={0.05}
            min={0}
            max={1.5}
          />
        )}
      </Stack>
    </FormProvider>
  )
}
