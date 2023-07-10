import { Icon, Stack } from "@osuresearch/ui"

export function Sidebar() {
  return (
    // Tagging, Sketching, Settings
    <Stack w={44} className="border-r border-r-surface-subtle" gap={0}>
      <Icon name="home" size={18} p="sm" className="border-l-2 border-primary" />
      <Icon name="home" size={18} p="sm" />
      <Icon name="home" size={18} p="sm" />

      <div className="h-full" />
      <Icon name="home" size={18} p="sm" />
    </Stack>
  )
}
