import { FormControlLabel, Switch } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export interface ToggleFieldProps {
  name: string
  label: string
  description?: React.ReactNode
}

/**
 * Switch (toggle) field wrapper around MUI.
 *
 * Must be used within an RHF context.
 */
export function ToggleField(props: ToggleFieldProps) {
  const { control } = useFormContext();

  const { name, label, description } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={(rhf) => (
        <FormControlLabel
          control={<Switch
            checked={rhf.field.value}
            onChange={rhf.field.onChange}
            color="primary"
          />}
          sx={{ minWidth: 140 }}
          labelPlacement="start"
          id={name}
          label={label}
        />
      )}
    />
  );
}
