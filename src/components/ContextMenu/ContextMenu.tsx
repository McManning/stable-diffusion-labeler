import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/hooks';
import { closeContextMenu } from '@/features/settings';
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Icon } from '@osuresearch/iconography';

/**
 * Global context menu for interaction with different components
 */
export function ContextMenu() {
  const ctx = useAppSelector((s) => s.settings.contextMenu);
  const dispatch = useDispatch();

  // Disable browser context menus across the board
  useEffect(() => {
    const close = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', close);

    return () => document.removeEventListener('contextmenu', close);
  }, []);

  const onClose = () => {
    dispatch(closeContextMenu());
  };

  const isOpen = !!ctx && ctx.position.y > 0 && ctx.position.x > 0;

  return (
    <Menu
      open={isOpen}
      onClose={onClose}
      anchorReference="anchorPosition"
      transitionDuration={0}
      anchorPosition={
        ctx ? { top: ctx.position.y, left: ctx.position.x } : undefined
      }
    >
      {ctx?.options.map((opt, idx) =>
        opt === 'divider' ? (
          <Divider />
        ) : (
          <MenuItem
            key={idx}
            onClick={() => {
              opt.action(ctx);
              onClose();
            }}
          >
            {opt.icon && (
              <ListItemIcon>
                <Icon name={opt.icon} />
              </ListItemIcon>
            )}
            <ListItemText>{opt.label}</ListItemText>
            <Typography variant="body2" color="text.secondary" ml={1}>
              {opt.accelerator}
            </Typography>
          </MenuItem>
        )
      )}
    </Menu>
  );
}
