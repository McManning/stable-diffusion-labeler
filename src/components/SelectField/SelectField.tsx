import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export interface SelectFieldProps {
  name: string
  label: string
  description?: React.ReactNode

  children?: React.ReactNode
}

/**
 * Select field wrapper around MUI.
 *
 * Must be used within an RHF context.
 */
export function SelectField(props: SelectFieldProps) {
  const { control } = useFormContext();

  const { name, label, description, children } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={(rhf) => (
        <FormControl size="small">
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            labelId={`${name}-label`}
            id={name}
            label={label}
            {...rhf.field}
          >
            {children}
          </Select>
        </FormControl>
      )}
    />
  )
}
