import { Icon, Stack, Text } from '@osuresearch/ui';

export function Empty() {
  return (
    <Stack align="center" mt="xxl">
      <Icon name="rui-illustration:no-search-results"
        size={200}
        c="clear"
        svgProps={{
          stroke: 'var(--rui-info)'
        }} />
      <Text>
        No images 😢
      </Text>
    </Stack>
  )
}
