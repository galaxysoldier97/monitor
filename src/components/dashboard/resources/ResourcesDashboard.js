import React, { useEffect, useState } from 'react';
import TecrepDashboardService from '../../../services/TecrepDashboardService';
import { TplLoading } from 'mt-react-library/containers/templates';
import { ErrorAlert } from '../../ErrorAlert';
import { t } from 'mt-react-library/functions';
import EntityStatusChart from '../EntityStatusChart';

const ResourcesBoard = () => {
  const [statusOfNumbers, setStatusOfNumbers] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    TecrepDashboardService.getResourcesStats()
    .then(res => setStatusOfNumbers(res.data.statusOfNumbers))
    .catch(err => setError(err));
  }, []);

  if (!statusOfNumbers) {
    return error ? <ErrorAlert message={error.message} /> : <TplLoading />;
  }
  return <EntityStatusChart name={t('menu.numbers')} status={statusOfNumbers} />;
};

ResourcesBoard.propTypes = {};
export default ResourcesBoard;
