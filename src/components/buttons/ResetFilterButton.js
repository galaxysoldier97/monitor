import React from 'react';
import { t } from 'mt-react-library/functions';
import { IconButton, Tooltip } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import PropTypes from 'prop-types';

export const ResetFilterButton = ({onClick}) => {
  return (
    <Tooltip title={t('resetFilter')}><IconButton size="small" onClick={onClick}><AutorenewIcon /></IconButton></Tooltip>
  );
};

ResetFilterButton.propTypes = {
  onClick: PropTypes.func
};
