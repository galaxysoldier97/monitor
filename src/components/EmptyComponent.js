import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

const EmptyComponent = (props) => {
  const {message, marginY = 0} = props;
  return (
    <Box marginY={marginY} margin="auto">
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Box marginTop={3} marginBottom={1} marginX="auto">
            <SearchIcon fontSize="large" />
          </Box>
        </Grid>
        <Grid item>
          <Box marginBottom={3} marginX="auto">
            <Typography variant="subtitle1" align="center">{message}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

EmptyComponent.propTypes = {
  message: PropTypes.string,
  marginY: PropTypes.number,
};

export default EmptyComponent;
