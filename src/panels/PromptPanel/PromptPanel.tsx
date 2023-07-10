import { Panel } from "@/components/Panel";
import { TagsField } from "@/components/TagsField";
import { Stack, Paper } from "@mui/material";

export function PromptPanel() {
  return (
    <Panel>
      {/* <Group align="center" justify="apart" w="100%">
        <SelectField name="template" aria-label="Template" placeholder="Use a template" w="300px">
          <Item>Foo</Item>
          <Item>None</Item>
        </SelectField>

        <SwitchField name="editable" label="Editable" />
      </Group> */}

      <TagsField name="positive" label="Positive" />

      {/* <TagsField name="negative" label="Negative" /> */}
    </Panel>
  )
}
