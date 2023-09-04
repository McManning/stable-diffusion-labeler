import { useState } from 'react';
import { ButtonBase, Button, Menu, styled } from '@mui/material';
import { MenuItemData, nestedMenuItemsFromObject } from '../MuiNestedMenu';

const StyledButton = styled(ButtonBase)(({ theme }) => ({
  height: 32,
  padding: '0 8px',
  opacity: 0.7,
  '&:hover': {
    opacity: 1,
  },
}));

export interface HeaderButtonProps {
  menuItemsData?: MenuItemData;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function HeaderButton(props: HeaderButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const { menuItemsData, onClick } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
    onClick && onClick(e);
  };
  const handleClose = () => setAnchorEl(null);

  const menuItems = nestedMenuItemsFromObject({
    handleClose,
    isOpen: open,
    menuItemsData: menuItemsData?.items ?? [],
  });

  return (
    <>
      <StyledButton onClick={handleClick}>
        {menuItemsData?.label ?? 'Menu'}
      </StyledButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menuItems}
      </Menu>
    </>
  );
}
