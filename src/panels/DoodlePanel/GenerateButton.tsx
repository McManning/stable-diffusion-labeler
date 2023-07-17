import { addImages, clearImages } from "@/features/generator";
import { useAppSelector } from "@/hooks";
import { useDoodleStage } from "@/hooks/useDoodleStage";
import { createTxt2ImgPayload } from "@/utils";
import { Button, ButtonGroup, ClickAwayListener, Grow, ListItemText, Menu, MenuItem, MenuList, Paper, Popper, Typography } from "@mui/material";
import { Icon } from "@osuresearch/iconography";
import Konva from "konva";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function GenerateButton() {
  const generator = useAppSelector((s) => s.generator);
  const settings = useAppSelector((s) => s.settings.integrations);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { exportDrawLayer } = useDoodleStage();

  const { sampler } = generator;


  // TODO: Move all this. Shouldn't exist in the button. Move to a hook.

  const onGenerate = async () => {
    const url = `${settings.sdapi}/txt2img`;

    setLoading(true);

    const b64img = await exportDrawLayer(sampler.width, sampler.height);

    // // TEMP: Just store.
    // dispatch(addImages([{
    //   id: Date.now().toString(),
    //   src: b64img,
    // }]));

    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        createTxt2ImgPayload(b64img, generator)
      )
    });

    const data = await res.json();

    if (Array.isArray(data.images)) {
      const images = data.images.map((b64: string, idx: number) => ({
        id: Date.now().toString(),
        src: `data:image/png;base64,${b64}`,
        info: data.info,
        // ControlNet preprocessed images follow the generated images.
        // This cannot be turned off for now. See: https://github.com/Mikubill/sd-webui-controlnet/issues/1432
        type: idx >= sampler.batchCount ? 'preprocessed' : 'txt2img'
      } as GeneratedImage));

      dispatch(addImages(images));
    }

    setLoading(false);
  }

  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const onClearHistory = () => {
    dispatch(clearImages());
    setOpen(false);
  }

  return (
    <>
    <ButtonGroup
      disabled={loading}
      variant="outlined"
      sx={{ justifyContent: 'right', whiteSpace: 'nowrap', backgroundColor: '#000' }}
    >
      <Button onClick={onGenerate} disabled={loading}>
        Generate {sampler.batchCount * sampler.batchSize} images
      </Button>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'generate-button-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label="select merge strategy"
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
        sx={{ padding: 0 }}
      >
        <Icon size={12} name="caret" />
      </Button>
    </ButtonGroup>

    <Menu
      anchorEl={anchorRef.current}
      open={open}
      onClose={() => setOpen(false)}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={onClearHistory}>
        <ListItemText>Clear history</ListItemText>
        {/* <Typography variant="body2" color="text.secondary" pl={2}>
          Shift+1
        </Typography> */}
      </MenuItem>
    </Menu>
    </>
  )
}
