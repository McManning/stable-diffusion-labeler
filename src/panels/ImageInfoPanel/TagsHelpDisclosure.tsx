import { useState } from "react";
import { Stack, Text, ExternalLink, Link, Icon, Group } from '@osuresearch/ui';

export function TagsHelpDisclosure() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Group p="md" fs="sm" justify="apart" w="100%">
        <div />
        <Link as="button" onClick={() => setOpen(true)}>
          <Icon name="question" size={14} pb="xxs" /> Help
        </Link>
      </Group>
    )
  }

  return (
    <Stack fs="sm" p="md">
      <Group justify="apart" w="100%">
        <Text fw="bold">Structure</Text>
        <Link as="button" onClick={() => setOpen(false)}>
          <Icon name="xmark" size={14} pb="xxs" /> Close
        </Link>
      </Group>

      <Text>
        &lt;Globals&gt;
        &lt;Type/Perspective/&quot;Of a...&quot;&gt;
        &lt;Action Words&gt; &lt;Subject Descriptions&gt;
        &lt;Notable Details&gt;
        &lt;Background/Location&gt;
        &lt;Loose Associations&gt;
      </Text>
      <Text fw="bold">Example</Text>
      <Text>
        a young woman, full body shot, from side, sitting, looking at viewer,
        smiling, head tilt, holding a phone, eyes closed, short brown hair,
        pale pink dress with dark edges, stuffed animal in lap, brown slippers,
        sunlight through windows as lighting source, brown couch, red patterned
        fabric on couch, wooden floor, white water-stained paint on walls,
        refrigerator in background, coffee machine sitting on a countertop,
        table in front of couch, bananas and coffee pot on table, white board
        on wall, clock on wall, stuffed animal chicken on floor, dreary environment
      </Text>
      <ExternalLink href="https://www.reddit.com/r/StableDiffusion/comments/118spz6/captioning_datasets_for_training_purposes/">
        Reference
      </ExternalLink>
    </Stack>
  )
}
