import { Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useDeepCompareEffect } from "react-use";

import { useAppSelector } from "@/hooks";
import { SliderField } from "@/components/SliderField";
import { updateBlend } from "@/features/generator";
import { useEffect } from "react";
import { Panel } from "@/components/Panel";

export function BlendPanel() {
  const blend = useAppSelector((s) => s.generator.blend);
  const dispatch = useDispatch();

  const methods = useForm<BlendSettings>({
    mode: 'all',
    defaultValues: blend,
  });

  const changes = methods.watch();

  useEffect(() => {
    dispatch(updateBlend(changes));
  }, [changes, dispatch]);

  const prompts = methods.watch('prompts');

  return (
    <FormProvider {...methods}>
      <Panel gap={2}>
        {Object.keys(prompts).map((name) =>
          <SliderField
            key={name}
            name={`prompts.${name}.weight`}
            label={prompts[name].label}
            description={prompts[name].help}
            step={0.05}
            min={0}
            max={1.5}
          />
        )}
      </Panel>
    </FormProvider>
  )
}
