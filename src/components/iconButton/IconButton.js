import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, IconButton } from "@material-ui/core";

export default function CustomIconButton({ icon, text, onClick }) {
  return (
    <>
      <Tooltip title={text}>
        <span style={{ paddingBottom: 3 }}>
          <IconButton onClick={onClick}>
            {icon}
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}

CustomIconButton.propTypes = {
  icon: PropTypes.node,
  text: PropTypes.string,
  onClick: PropTypes.func
};
