import React, { useState } from 'react';
import PageBase from '../../../components/PageBase';
import { Snackbar } from '@material-ui/core';
import { Add, Cancel } from '@material-ui/icons';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { Auth } from '../../../services/Auth';
import { t } from 'mt-react-library/functions';
import '../../../css/index.css';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { serviceAccessFields } from '../../../config/service/serviceAccess/serviceAccessFields';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { ServiceAccessActions } from './ServiceAccessActions';
import { getServiceDisplayMapper } from '../../../helpers/entityMapper';
import { useFetchAccessTypes } from '../../../hooks/useFetchAccessTypes';
import { useFetchSrvActivities } from '../../../hooks/useFetchSrvActivities';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepServiceAccessService from '../../../services/services/TecrepServiceAccessService';
import { useUrlForm } from '../../../hooks/useUrlForm';
import { useSearchList } from '../../../hooks/useSearchList';
import { SearchEntities } from '../../../helpers/SearchEntities';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';

export const buildServiceAccessHeaders = () => populateEntityConfiguration(serviceAccessFields);

export const getServiceRowMapper = (item, onServiceUpdate) => {
  let mapped = {...item};
  ['activation', 'equipmentLink', 'onGoingAction', 'number', 'mainRangeId'].map(key => mapped[key] = getServiceDisplayMapper(item, key));
  mapped.actions = <ServiceAccessActions item={item} onServiceUpdate={onServiceUpdate} />;
  return [mapped, {}];
};

const ServiceAccessManagerPage = () => {
  useFetchAccessTypes({type: 'srv'});
  useFetchSrvActivities();
  const headers = buildServiceAccessHeaders();
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, fetch, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.serviceAccess, isFilterReady: ready});
  const [notification, setNotification] = useState({visible: false, message: ''});
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  const createServiceAccess = data => {
    TecrepServiceAccessService.addAccessService(data)
    .then(() => {
      fetch();
      setCreatedSuccessfully(true);
      setNotification({visible: true, message: t('service.access.createSuccess', data.number)});
      setTimeout(() => setCreatedSuccessfully(false), 500);
    })
    .catch(error => setNotification({visible: true, message: getErrorMessage(error)}));
  };


  const addActionButton = Auth.connectedUserHasPermission(resourcesScopes.serviceAccess.create) &&
    <OpenTplDialButton title={t('add')}
                       key={'add-service-access-' + createdSuccessfully}
                       headers={headers.filter(h => h.addable)}
                       confirmProps={{label: t('add'), icon: <Add />, name: 'confirm_add'}}
                       cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
                       showProps={{icon: <Add />, label: t('add'), name: 'add'}}
                       onConfirm={createServiceAccess}
                       autocloseOnConfirm={false}
                       closed={createdSuccessfully}
    />;

  const handleFilterChange = filterChange => setFilters({...filterChange, page: 0});

  return (
    <PageBase title={t('service.access.title')} navigation={t('service.access.navigation')} actionButton={addActionButton}>
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error && (
        <TplEnhancedTable rows={list.data}
                          headers={headers}
                          rowMapper={item => getServiceRowMapper(item, fetch)}
                          filterable
                          pageable
                          paginationDefault={{number: Number(filters.page), size: Number(filters.size), totalElements}}
                          onPageChange={handlePageChange}
                          filterDefault={filters}
                          onFilterChange={handleFilterChange}
                          headerFreeContent={<ResetFilterButton onClick={reset} />}
        />)}
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </PageBase>
  );
};

ServiceAccessManagerPage.propTypes = {};

export default ServiceAccessManagerPage;
