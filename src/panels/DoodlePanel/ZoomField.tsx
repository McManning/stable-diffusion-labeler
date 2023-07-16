import { setScale } from "@/features/doodle";
import { useAppSelector } from "@/hooks";
import { OutlinedInput, InputAdornment, Button, Popover, Typography, Stack, Menu, MenuItem, ListItemText } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";

export function ZoomField() {
  const scale = useAppSelector((s) => s.doodle.scale);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dispatch = useDispatch();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  }

  const onClose = () => {
    setAnchorEl(null);
  }

  const onSetScale = (newScale: number) => {
    dispatch(setScale(newScale));
    onClose();
  }

  const onZoomToFit = () => {
    alert('TODO');
    // need canvas dimensions and workspace dimensions.
    onClose();
  }

  return (
    <>
    <Button variant="contained" onClick={onClick}>
      {Math.round(scale * 100)}%
    </Button>

    <Menu
      anchorEl={anchorEl}
      open={anchorEl !== null}
      onClose={onClose}
    >
      {/* <MenuItem>
        <OutlinedInput type="number" size="small" sx={{ width: '10ch' }}
          endAdornment={<InputAdornment position="end">%</InputAdornment>}
        />
      </MenuItem> */}
      <MenuItem onClick={onZoomToFit}>
        <ListItemText>Zoom to fit</ListItemText>
        <Typography variant="body2" color="text.secondary" pl={2}>
          Shift+1
        </Typography>
      </MenuItem>
      <MenuItem onClick={() => onSetScale(0.5)}>
        <ListItemText>Zoom to 50%</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => onSetScale(1)}>
        <ListItemText>Zoom to 100%</ListItemText>
        <Typography variant="body2" color="text.secondary" pl={2}>
          Ctrl+0
        </Typography>
      </MenuItem>
      <MenuItem onClick={() => onSetScale(2)}>
        <ListItemText>Zoom to 200%</ListItemText>
      </MenuItem>
    </Menu>
    {/* <Popover
      open={anchorEl !== null}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Stack>
        <OutlinedInput type="number" size="small" sx={{ width: '10ch' }}
          endAdornment={<InputAdornment position="end">%</InputAdornment>}
        />

        <Button variant="text">Zoom to fit (Shift+1)</Button>
        <Button variant="text">Zoom to 50%</Button>
        <Button variant="text">Zoom to 100% (Ctrl+0)</Button>
        <Button variant="text">Zoom to 200%</Button>
      </Stack>
    </Popover> */}
  </>
  )
}
