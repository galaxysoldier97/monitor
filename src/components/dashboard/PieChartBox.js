import React from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, Grid, Paper, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const PieChartBox = (props) => {
  return (
    <Paper>
      <Box padding={3}>
        <Grid container spacing={2}>
          {props.name && <Grid item xs={12}>
            <Typography>{props.name}</Typography>
          </Grid>}
          <Grid item xs={12} sm={8}>
            <ResponsiveContainer height={290} width="100%">
              <PieChart>
                <Pie
                  innerRadius={70}
                  outerRadius={120}
                  data={props.data}
                  dataKey="value"
                  fill="#8884d8">
                  {
                    props.data.map((item) => <Cell key={item.name} fill={item.color} />)
                  }
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container direction="column" alignItems="flex-end" spacing={1}>
              {props.data.map((item, index) =>
                <Grid item key={index}>
                  <Chip color="secondary" style={{backgroundColor: item.color || grey[500]}} label={`${item.value} ${item.name}`} />
                </Grid>,
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

PieChartBox.propTypes = {
  data: PropTypes.array,
  name: PropTypes.string,
};

export default PieChartBox;
