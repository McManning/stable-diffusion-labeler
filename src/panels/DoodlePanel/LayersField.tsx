import { setLayers } from "@/features/doodle";
import { useAppSelector } from "@/hooks";
import { Button, Popover, Slider, Stack, ToggleButton, Typography } from "@mui/material";
import { Icon } from "@osuresearch/iconography";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";



const layers = {
  draw: {}
}

export function LayersField() {
  const layers = useAppSelector((s) => s.doodle.layers);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  // Toggle layer visibility for the specified layer
  const toggleVisible = (e: React.MouseEvent, layerId: string) => {
    const updates = layers.map((layer) => ({
      ...layer,
      visible: (layer.id === layerId) ? !layer.visible : layer.visible,
    }));

    dispatch(setLayers(updates));
  }

  const setOpacity = (layerId: string, opacity: number) => {
    const updates = layers.map((layer) => ({
      ...layer,
      opacity: (layer.id === layerId) ? opacity : layer.opacity,
    }));

    dispatch(setLayers(updates));
  }

  return (
    <>
      <Button
        ref={anchorRef}
        aria-describedby="layers-popover"
        variant="contained"
        onClick={() => setOpen(true)}
      >
        Layers
      </Button>
      <Popover
        id="layers-popover"
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Stack fontSize="small" width={200} p={2}>
          {layers.map((layer) =>
            <div key={layer.id}>
              <Stack direction="row" gap={1} alignItems="center">
                <ToggleButton
                  size="small"
                  value={layer.id}
                  selected={layer.visible}
                  onClick={toggleVisible}
                >
                  <Icon name={layer.visible ? 'eye' : 'eyeSlash'} />
                </ToggleButton>
                {layer.id}
              </Stack>

              <Slider
                orientation="horizontal"
                aria-label="Opacity"
                valueLabelDisplay="auto"
                value={layer.opacity}
                onChange={(e, v) => setOpacity(layer.id, v as number)}
                min={0}
                max={1}
                step={0.05}
              />
            </div>
          )}
        </Stack>

      </Popover>
  </>
  )
}
