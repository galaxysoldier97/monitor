import React, { useEffect, useState } from 'react';
import { TplLoading } from 'mt-react-library/containers/templates';
import TecrepDashboardService from '../../../services/TecrepDashboardService';
import { ErrorAlert } from '../../ErrorAlert';
import { t } from 'mt-react-library/functions';
import EntityStatusChart from '../EntityStatusChart';

const ServicesBoard = () => {
  const [statusOfServices, setStatusOfServices] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    TecrepDashboardService.getServicesStats()
    .then(res => setStatusOfServices(res.data.statusOfServices))
    .catch(err => setError(err));
  }, []);

  if (!statusOfServices) {
    return error ? <ErrorAlert message={error.message} /> : <TplLoading />;
  }

  return <EntityStatusChart name={t('menu.services')} status={statusOfServices} />;
};

export default ServicesBoard;
