import { Panel } from "@/components/Panel";
import { SelectField } from "@/components/SelectField";
import { TagsField } from "@/components/TagsField";
import { Stack, Paper, MenuItem } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

export function PromptPanel() {
  const methods = useForm({
    defaultValues: {
      positive: '',
      negative: '',
    }
  });

  return (
    <Panel>
      <FormProvider {...methods}>
        <Stack gap={2} p={2} width="100%">

          <Stack direction="row">
            <SelectField name="template" label="Template">
              <MenuItem value="foo">Foo</MenuItem>
              <MenuItem value="bar">Bar</MenuItem>
            </SelectField>
          </Stack>

          <TagsField name="positive" label="Positive" />
          <TagsField name="negative" label="Negative" />
        </Stack>
      </FormProvider>
    </Panel>
  )
}
