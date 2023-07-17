import { Link, Stack, TextField, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useDeepCompareEffect } from "react-use";

import { useAppSelector } from "@/hooks";
import { SettingsState, updateIntegrations } from "@/features/settings";
import { Panel } from "@/components/Panel";

export function SettingsPanel() {
  const integrations = useAppSelector((s) => s.settings.integrations);

  const dispatch = useDispatch();

  const methods = useForm<IntegrationSettings>({
    mode: 'all',
    defaultValues: integrations,
  });

  const { register, watch } = methods;

  const changes = watch();
  useDeepCompareEffect(() => {
    dispatch(updateIntegrations(changes));
  }, [changes]);

  return (
    <Panel gap={2}>
      <Typography variant="h5">Integrations</Typography>

      <Stack gap={4}>
        <Typography>Settings for integrating with third party services</Typography>

        <TextField
          {...register('sdapi')}
          label="Stable Diffusion API"
          helperText={<>
            For more information, see the guide on
            the <Link target="_blank" href="https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API">Stable Diffusion WebUI Wiki</Link>
          </>}
        />

        <TextField
          {...register('booruApi')}
          label="Booru Tags API"
          helperText={<>
            Add a <em>{'{terms}'}</em> placeholder in your URL to injecting search terms
          </>}
        />
      </Stack>
    </Panel>
  )
}
