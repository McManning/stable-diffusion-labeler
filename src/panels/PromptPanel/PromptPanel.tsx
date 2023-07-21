import { Stack, Paper, MenuItem, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { Panel } from '@/components/Panel';
import { SelectField } from '@/components/SelectField';
import { TagsField } from '@/components/TagsField';
import { updatePrompt, updateSampler } from '@/features/generator';
import { useAppSelector } from '@/hooks';
import { SliderField } from '@/components/SliderField';
import { useDeepCompareEffect } from 'react-use';

function BlendPromptTag({
  prompt,
  positive,
}: {
  prompt: BlendPrompt;
  positive?: boolean;
}) {
  if (prompt.positive && prompt.positive.length > 0 && positive) {
    return (
      <span>
        {prompt.positive.replace('{weight}', prompt.weight.toFixed(2))},{' '}
      </span>
    );
  }

  if (prompt.negative && prompt.negative.length > 0 && !positive) {
    return (
      <span>
        {prompt.negative.replace('{weight}', prompt.weight.toFixed(2))},{' '}
      </span>
    );
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
    defaultValues: {
      ...prompt,
      ...sampler,
    },
  });

  const changes = methods.watch();

  const { control } = methods;

  useDeepCompareEffect(() => {
    dispatch(updatePrompt(changes));
    dispatch(updateSampler(changes));
  }, [changes]);

  const blendPositives = Object.keys(blend.prompts).filter(
    (id) => blend.prompts[id].weight > 0 && blend.prompts[id].positive
  );
  const blendNegatives = Object.keys(blend.prompts).filter(
    (id) => blend.prompts[id].weight > 0 && blend.prompts[id].negative
  );

  return (
    <FormProvider {...methods}>
      <Panel gap={2}>
        <Stack direction="row">
          <SelectField name="template" label="Template">
            {templates.map((t) => (
              <MenuItem key={t.name} value={t.name}>
                {t.name}
              </MenuItem>
            ))}
          </SelectField>
        </Stack>

        <Stack direction="row" gap={4}>
          <SliderField
            label="Width"
            name="width"
            step={64}
            min={64}
            max={2048}
          />

          <SliderField
            label="Height"
            name="height"
            step={64}
            min={64}
            max={2048}
          />
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

        {/* {blendPositives &&
          <Typography fontSize="small" color="text.secondary">
            <strong>Blended: </strong>
            {blendPositives.map((id) =>
              <BlendPromptTag key={id} prompt={blend.prompts[id]} positive />
            )}
          </Typography>
        } */}

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

        {/* {blendNegatives &&
          <Typography fontSize="small" color="text.secondary">
            <strong>Blended: </strong>
            {blendNegatives.map((id) =>
              <BlendPromptTag key={id} prompt={blend.prompts[id]} />
            )}
          </Typography>
        } */}

        <Typography fontSize="small">
          Generating {sampler.batchCount * sampler.batchSize} images at{' '}
          {sampler.width}&times;{sampler.height}
        </Typography>
      </Panel>
    </FormProvider>
  );
}
