import { Icon } from "@osuresearch/iconography";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import party from "party-js";
import { Box, Button, ButtonGroup, ListItemText, Menu, MenuItem, styled } from "@mui/material";

import { addImages, clearImages } from "@/features/generator";
import { useAppSelector } from "@/hooks";
import { useControlNet } from "@/hooks/useControlNet";
import { useDoodleStage } from "@/hooks/useDoodleStage";
import { createTxt2ImgPayload } from "@/utils";


const GeneratorProgress = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: 0,
  height: 4,
  backgroundColor: theme.palette.success.main,
  borderTopLeftRadius: 3,
}))

/**
 * Can't do THIS during my day job.
 */
function ConfettiAnchor({ activate }: { activate: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activate && ref.current) {
      party.sparkles(ref.current, {
        count: party.variation.range(8, 12),
        size: party.variation.range(0.5, 0.8),
        lifetime: party.variation.range(0.5, 1),
      })
    }
  }, [ref, activate]);

  return (
    <Box sx={{ position: 'absolute', top: 0, right: 0 }} ref={ref}>
      {activate}
    </Box>
  );
}

export function GenerateButton() {
  const generator = useAppSelector((s) => s.generator);
  const settings = useAppSelector((s) => s.settings.integrations);
  const dispatch = useDispatch();

  const { exportDrawLayer } = useDoodleStage();

  const { sampler } = generator;

  const { loading, error, generate, progress, eta } = useControlNet();

  const onGenerate = async () => {
    await generate(exportDrawLayer);
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
      sx={{
        minWidth: 220,
        position: 'relative',
        justifyContent: 'right',
        whiteSpace: 'nowrap',
        backgroundColor: '#000'
      }}
    >
      <Button onClick={onGenerate} disabled={loading} fullWidth>
        {loading && <>ETA: {Math.max(0, eta).toFixed(1)} seconds</>}
        {!loading && <>Generate {sampler.batchCount * sampler.batchSize} images</>}
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
      {loading &&
        <GeneratorProgress style={{ width: `${progress * 100}%`}} />
      }
      <ConfettiAnchor activate={progress > 0.999} />
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
