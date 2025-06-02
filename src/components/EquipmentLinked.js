import React from 'react';
import { Grid, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { t } from 'mt-react-library/functions';
import WarningIcon from '@material-ui/icons/Warning';
import { routePaths, ROUTES } from '../config/routes';

const EquipmentLinked = (props) => {
  const {eqmId, eqmCategory} = props;

  const getEquipmentLink = () => {
    switch (eqmCategory) {
      case 'CPE':
        return ROUTES.cpeInfo.path.replace(':equipmentId', eqmId);
      case 'ANCILLARY':
        return ROUTES.ancillaryEquipmentsInfo.path.replace(':equipmentId', eqmId);
      default:
        return routePaths.equipmentInfo.replace(':equipmentId', eqmId);
    }
  };

  if (eqmId && eqmCategory) {
    return <Link to={getEquipmentLink()}>{eqmId} <strong>-</strong> {eqmCategory}</Link>;
  }

  if (eqmId) {
    return (
      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item>
          {eqmId}
        </Grid>
        <Grid item>
          <Tooltip title={t('equipmentCategoryUndefined')}><WarningIcon fontSize="small" style={{ color: 'orange' }} /></Tooltip>
        </Grid>
      </Grid>
    );
  }

  return <div>-</div>;
};

EquipmentLinked.propTypes = {
  eqmId: PropTypes.number || null,
  eqmCategory: PropTypes.string || null,
};

export default EquipmentLinked;
