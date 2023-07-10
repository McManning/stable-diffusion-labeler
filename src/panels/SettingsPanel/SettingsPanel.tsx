import { useAppSelector } from "@/hooks";
import { Divider, ExternalLink, Heading, Stack, Text, TextField } from "@osuresearch/ui";

export function SettingsPanel() {
  const settings = useAppSelector((s) => s.settings);

  return (
    <Stack p="sm">
      <Text fs="md">Integrations</Text>

      <Stack gap="xl" align="stretch">
        <Text fs="sm" c="neutral-subtle">Settings for integrating with third party services</Text>

        <TextField
          name="sdapi"
          label="Stable Diffusion API"
          placeholder="http://localhost:7860/sdapi/v1"
          value={settings.integrations.sdapi}
          description={
            <>
              URL to your Auto1111 instance API. For more information,
              check out the <ExternalLink href="https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API">
                stable-diffusion-webui wiki
              </ExternalLink>
            </>
          }
        />

        <TextField
          name="booru"
          label="Booru Tags API"
          value={settings.integrations.booru}
          description="Booru tags autocomplete API. Search term will be added as a suffix"
        />
      </Stack>

      <Divider />
      <Text fs="md">Stable Diffusion img2img</Text>

      <Stack gap="xl">
        <Text fs="sm" c="neutral-subtle">Settings when executing img2img for content erasers</Text>
      </Stack>
    </Stack>
  )
}
