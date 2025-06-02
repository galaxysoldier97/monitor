import React from 'react';
import PropTypes from 'prop-types';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

export const BooleanInfoIcon = (props) => {
  const {value} = props;
  return value ? <CheckIcon fontSize="small" style={{color: 'green'}} /> : <ClearIcon fontSize="small" style={{color: 'grey'}}/>;
};

BooleanInfoIcon.propTypes = {
  value: PropTypes.bool,
};
