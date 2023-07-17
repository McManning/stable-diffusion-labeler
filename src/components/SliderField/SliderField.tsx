
import React, { HTMLAttributes, useState } from 'react';
import { Box, Grid, Input, Slider, Typography, InputBaseComponentProps, OutlinedInput } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

export interface SliderFieldProps extends HTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  description?: React.ReactNode

  min?: number
  max?: number
  step?: number
}

/**
 * Custom slider with numeric input.
 *
 * Must be used within an RHF context.
 */
export function SliderField(props: SliderFieldProps) {
  const { control } = useFormContext();

  const { min, max, step, label, name, description } = props;

  // TODO: aria describedby for description content

  return (
    <Controller
      name={name}
      control={control}
      render={(rhf) => (
        <Box width="100%">
          <Typography component="label" id={`${name}-label`} htmlFor={name}>
            {label}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              {/* {JSON.stringify(rhf.field)} */}
              <Slider
                min={min}
                max={max}
                step={step}
                value={rhf.field.value}
                onChange={rhf.field.onChange}
                aria-labelledby={`${name}-label`}
              />
            </Grid>
            <Grid item>
              <OutlinedInput
                id={name}
                value={rhf.field.value}
                sx={{
                  width: '9ch',
                }}
                size="small"
                inputProps={{
                  onChange: rhf.field.onChange,
                  onBlur: rhf.field.onBlur,
                  ref: rhf.field.ref,
                  step,
                  min,
                  max,
                  type: 'number',
                  'aria-labelledby': `${name}-label`,
                }}
              />
            </Grid>
          </Grid>
          {description &&
            <Typography fontSize="small" color="text.secondary">{description}</Typography>
          }
        </Box>
      )}
    />
  );
}
