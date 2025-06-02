import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import TecrepBuildingService from '../services/address/TecrepBuildingService';
import {ROUTES} from "../config/routes";

const AccessPointLink = ({accessPointId}) => {

  const [ptoId, setPtoId] = useState();
  const fetchPto = () => {
    TecrepBuildingService.getBuildingFlatPtoAccessPoint(accessPointId)
      .then(data => setPtoId(data.pto.ptoTechnicalId));
  };

  const getPptoLink = () => {
    fetchPto();
    return ptoId ? ROUTES.buildingFlatPtoInfo.path.replace(":buildingFlatPtoId",  ptoId) : "#";
  };

  return <Link to={getPptoLink()}>{accessPointId}</Link>;
};

AccessPointLink.propTypes = {
  accessPointId: PropTypes.string.isRequired,
};

export default AccessPointLink;
