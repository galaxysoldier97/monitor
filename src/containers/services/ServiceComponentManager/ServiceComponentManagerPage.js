import React, { useState } from 'react';
import PageBase from '../../../components/PageBase';
import { Snackbar } from '@material-ui/core';
import { Add, Cancel } from '@material-ui/icons';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { Auth } from '../../../services/Auth';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { serviceComponentFields } from '../../../config/service/serviceComponent/serviceComponentFields';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { ServiceComponentActions } from './ServiceComponentActions';
import { getServiceDisplayMapper } from '../../../helpers/entityMapper';
import { useFetchSrvActivities } from '../../../hooks/useFetchSrvActivities';
import { useUrlForm } from '../../../hooks/useUrlForm';
import { useSearchList } from '../../../hooks/useSearchList';
import { SearchEntities } from '../../../helpers/SearchEntities';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepServiceComponentService from '../../../services/services/TecrepServiceComponentService';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';

export const buildHeaders = () => populateEntityConfiguration(serviceComponentFields);

const rowMapper = (item, onServiceUpdate) => {
  let mapped = {...item};
  ['serviceAccessLink', 'activation', 'number', 'mainRangeId', 'onGoingAction'].map(key => mapped[key] = getServiceDisplayMapper(item, key));
  mapped.actions = <ServiceComponentActions item={item} onServiceUpdate={onServiceUpdate} />;
  return [mapped, {}];
};

const ServiceComponentManagerPage = () => {
  useFetchSrvActivities();
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, fetch, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.serviceComponent, isFilterReady: ready});
  const [notification, setNotification] = useState({visible: false, message: ''});
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  const headers = buildHeaders();

  const createServiceComponent = data => {
    TecrepServiceComponentService.addServiceComponent(data)
    .then(() => {
      fetch();
      setCreatedSuccessfully(true);
      setNotification({visible: true, message: t('service.component.createSuccess', data.number)});
      setTimeout(() => setCreatedSuccessfully(false), 500);
    })
    .catch(error => setNotification({visible: true, message: getErrorMessage(error)}));
  };

  const handleFilterChange = filterChange => setFilters({...filterChange, page: 0});

  const addActionButton = Auth.connectedUserHasPermission(resourcesScopes.serviceComponent.create) &&
    <OpenTplDialButton title={t('add')}
                       key={'add-service-component-' + createdSuccessfully}
                       headers={headers.filter(h => h.addable)}
                       confirmProps={{label: t('add'), icon: <Add />, name: 'confirm_add'}}
                       cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
                       showProps={{icon: <Add />, label: t('add'), name: 'add'}}
                       onConfirm={createServiceComponent}
                       autocloseOnConfirm={false}
                       closed={createdSuccessfully}
    />;

  return (
    <PageBase title={t('service.component.title')} navigation={t('service.component.navigation')} actionButton={addActionButton}>
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error && (
        <TplEnhancedTable rows={list.data}
                          headers={headers}
                          rowMapper={item => rowMapper(item, fetch)}
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

ServiceComponentManagerPage.propTypes = {};

export default ServiceComponentManagerPage;
