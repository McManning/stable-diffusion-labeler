import { Stack, Paper, MenuItem, Typography } from "@mui/material";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { Panel } from "@/components/Panel";
import { SelectField } from "@/components/SelectField";
import { TagsField } from "@/components/TagsField";
import { updatePrompt } from "@/features/generator";
import { useAppSelector } from "@/hooks";

function BlendPromptTag({ prompt, positive }: { prompt: BlendPrompt, positive?: boolean }) {
  if (prompt.positive && prompt.positive.length > 0 && positive) {
    return <span>{prompt.positive.replace('{weight}', prompt.weight.toFixed(2))}, </span>
  }

  if (prompt.negative && prompt.negative.length > 0 && !positive) {
    return <span>{prompt.negative.replace('{weight}', prompt.weight.toFixed(2))}, </span>
  }

  return null;
}

export function PromptPanel() {
  const templates = useAppSelector((s) => s.generator.templates);
  const blend = useAppSelector((s) => s.generator.blend);
  const sampler = useAppSelector((s) => s.generator.sampler);
  const prompt = useAppSelector((s) => s.generator.prompt);
  const dispatch = useDispatch();

  const methods = useForm({
    mode: 'all',
    defaultValues: prompt
  });

  const changes = methods.watch();

  const { control } = methods;

  useEffect(() => {
    dispatch(updatePrompt(changes));
  }, [changes, dispatch]);

  const blendPositives = Object.keys(blend.prompts).filter((id) => blend.prompts[id].weight > 0 && blend.prompts[id].positive);
  const blendNegatives = Object.keys(blend.prompts).filter((id) => blend.prompts[id].weight > 0 && blend.prompts[id].negative);

  return (
    <FormProvider {...methods}>
      <Panel gap={2}>
        <Stack direction="row">
          <SelectField name="template" label="Template">
            {templates.map((t) =>
              <MenuItem key={t.name} value={t.name}>{t.name}</MenuItem>
            )}
          </SelectField>
        </Stack>

        <Controller
          name="positive"
          control={control}
          render={(rhf) => (
            <TagsField
              name={rhf.field.name}
              label="Positive"
              value={rhf.field.value}
              onChange={(value) => rhf.field.onChange(value)}
            />
          )}
        />

        {blendPositives &&
          <Typography fontSize="small" color="text.secondary">
            <strong>Blended: </strong>
            {blendPositives.map((id) =>
              <BlendPromptTag key={id} prompt={blend.prompts[id]} positive />
            )}
          </Typography>
        }

        <Controller
          name="negative"
          control={control}
          render={(rhf) => (
            <TagsField
              name={rhf.field.name}
              label="Negative"
              value={rhf.field.value}
              onChange={(value) => rhf.field.onChange(value)}
            />
          )}
        />

        {blendNegatives &&
          <Typography fontSize="small" color="text.secondary">
            <strong>Blended: </strong>
            {blendNegatives.map((id) =>
              <BlendPromptTag key={id} prompt={blend.prompts[id]} />
            )}
          </Typography>
        }

        <Typography fontSize="small">
          Generating {sampler.batchCount * sampler.batchSize} images
          at {sampler.width}&times;{sampler.height}
        </Typography>
      </Panel>
    </FormProvider>
  )
}
