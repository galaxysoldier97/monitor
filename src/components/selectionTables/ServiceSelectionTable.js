import React, { PropTypes } from 'react';
import { serviceFields } from '../../config/service/serviceFields';
import { populateEntityConfiguration } from '../../helpers/entityHelper';
import TecrepServiceService from '../../services/services/TecrepServiceService';
import { useFetchSrvActivities } from '../../hooks/useFetchSrvActivities';
import { getServiceDisplayMapper } from '../../helpers/entityMapper';
import GenericSelectionTable from './GenericSelectionTable';

const ServiceSelectionTable = ({name, serviceId, values, onChange}) => {
  useFetchSrvActivities();

  const itemsFetcher = (filter, pagination) => {
    return TecrepServiceService.search(filter, pagination.number, pagination.size).then(data => ({
      data: data._embedded ? data._embedded.serviceaccesses : [],
      totalElements: data.page.totalElements,
    }));
  };

  const rowMapper = item => {
    const mapped = {...item};
    ['activation', 'equipmentLink', 'onGoingAction', 'number', 'mainRangeId'].map(key => mapped[key] = getServiceDisplayMapper(item, key));
    return [mapped];
  };

  return (
    <GenericSelectionTable
      name={name}
      initialFilter={{serviceCategory: 'ACCESS'}}
      itemsFetcher={itemsFetcher}
      itemFetcher={() => serviceId && TecrepServiceService.getService(serviceId)}
      itemIdentifier={s => s.serviceId === serviceId}
      tableHeader={populateEntityConfiguration(serviceFields)}
      rowMapper={rowMapper}
      values={values}
      onChange={onChange}
    />
  );
};

ServiceSelectionTable.propTypes = {
  name: PropTypes.string,
  serviceId: PropTypes.string,
  values: PropTypes.object,
  onChange: PropTypes.func,
};

export default ServiceSelectionTable;
