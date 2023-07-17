import { Tooltip } from "@mui/material";

export interface HumanizeValueProps {
  value: number
}

export function HumanizedValue({ value }: HumanizeValueProps) {
  const compact = Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);
  const long = Intl.NumberFormat('en-US', { notation: 'standard' }).format(value);

  return (
    <Tooltip title={long}>
      <strong>
        {compact}
      </strong>
    </Tooltip>
  )
}
