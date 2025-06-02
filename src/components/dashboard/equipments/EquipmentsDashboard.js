import React, { useEffect, useState } from 'react';
import { TplLoading } from 'mt-react-library/containers/templates';
import TecrepDashboardService from '../../../services/TecrepDashboardService';
import { ErrorAlert } from '../../ErrorAlert';
import { t } from 'mt-react-library/functions';
import EntityStatusChart from '../EntityStatusChart';

const EquipmentsBoard = () => {
  const [statusOfEquipments, setStatusOfEquipments] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    TecrepDashboardService.getEquipmentsStats()
    .then(res => setStatusOfEquipments(res.data.statusOfEquipments))
    .catch(err => setError(err));
  }, []);

  if (!statusOfEquipments) {
    return error ? <ErrorAlert message={error.message} /> : <TplLoading />;
  }

  return <EntityStatusChart name={t('menu.equipments')} status={statusOfEquipments} />;
};
export default EquipmentsBoard;
