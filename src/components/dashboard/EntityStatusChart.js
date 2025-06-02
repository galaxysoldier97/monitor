import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { CropDin } from '@material-ui/icons';
import PieChartBox from './PieChartBox';
import { statusToPieMapping } from './statusToPieMapping';
import PropTypes from 'prop-types';

const EntityStatusChart = (props) => {
  const {status, name} = props;
  return (
    <Box margin="auto" maxWidth={800}>
      <Grid container direction="column" alignItems="stretch" spacing={1}>
        <Grid item>
          <Box paddingTop={2}>
            <Typography variant="h5" color="primary" display="inline">{Object.values(status).reduce((total, value) => total + value, 0)} </Typography>
            <Typography variant="h5" display="inline"> {name}</Typography>
          </Box>
        </Grid>
        <Grid item>
          {Object.keys(status).length > 0 &&
          <PieChartBox data={Object.keys(status).map(statusKey => (
            {
              name: statusToPieMapping[statusKey] && statusToPieMapping[statusKey].name || statusKey,
              color: statusToPieMapping[statusKey] && statusToPieMapping[statusKey].color,
              icon: <CropDin />, value: status[statusKey],
            }))} />
          }
        </Grid>
      </Grid>
    </Box>
  );
};

EntityStatusChart.propTypes = {
  status: PropTypes.object,
  name: PropTypes.string,
};

export default EntityStatusChart;
