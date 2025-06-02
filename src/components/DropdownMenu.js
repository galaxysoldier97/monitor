import React, { useState } from 'react';
import { IconButton, Menu } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import PropTypes from 'prop-types';

const DropdownMenu = ({children, hideEmpty = true}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenu = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const menuItems = children(handleClose);
  const hideIfNullItems = hideEmpty && menuItems === null;
  if (hideIfNullItems || !menuItems || menuItems.length === 0) {
    return null;
  }

  return (
    <div>
      <IconButton color="inherit" aria-haspopup="true" onClick={handleMenu}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
        {menuItems}
      </Menu>
    </div>
  );
};

DropdownMenu.propTypes = {
  children: PropTypes.func.isRequired,
  hideEmpty: PropTypes.bool,
};

export default DropdownMenu;
