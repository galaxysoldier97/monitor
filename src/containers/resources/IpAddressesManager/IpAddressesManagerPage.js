import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem, Snackbar } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import PageBase from '../../../components/PageBase';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { ErrorAlert } from '../../../components/ErrorAlert';
import TecrepIpAddressesService from '../../../services/resources/TecrepIpAddressesService';
import { ipAddressesFields } from '../../../config/resources/ipAddresses/ipAddressesFields';
import { ipAddressOfferTypes } from '../../../config/resources/ipAddresses/ipAddressOfferTypes';
import { IpAddressesActions } from './IpAddressesActions';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import Auth from '../../../services/Auth';
import { ipAddressesStatusForCreation } from '../../../config/resources/ipAddresses/ipAddressesStatus';
import { ipAddressesActivity } from '../../../config/resources/ipAddresses/ipAddressesActivity';
import DropdownMenu from '../../../components/DropdownMenu';
import { getIpAddressDisplayMapper } from '../../../helpers/entityMapper';
import { useUrlForm } from '../../../hooks/useUrlForm';
import { useSearchList } from '../../../hooks/useSearchList';
import { SearchEntities } from '../../../helpers/SearchEntities';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';

const dropdownMenu = (
  <DropdownMenu>
    {() => {
      const submenuItems = [];
      if (Auth.connectedUserHasPermission(resourcesScopes.ipAddresses.edit)) {
        submenuItems.push(<MenuItem id="import" key="import" component={Link} to="/importer/ipAddresses/import">{t('import.from.file')}</MenuItem>);
      }
      return submenuItems;
    }}
  </DropdownMenu>
);

const IpAddressesManagerPage = () => {
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, fetch, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.ipAddresses, isFilterReady: ready});
  const [notification, setNotification] = useState({visible: false, message: ''});
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  const rowMapper = row => {
    const mapped = {...row};
    ipAddressesFields.forEach(field => mapped[field.id] = getIpAddressDisplayMapper(row, field.id));
    const actions = <IpAddressesActions ipAddress={row} afterEdit={fetch} />;
    return [{...mapped, actions}, {}];
  };

  const handleFilterChange = filterChange => setFilters({...filterChange, page: 0});

  const createIpAddress = data => {
    TecrepIpAddressesService.create(data)
    .then(() => {
      fetch();
      setCreatedSuccessfully(true);
      setNotification({visible: true, message: t('ipAddresses.createSuccess', data.ipAddress)});
      setTimeout(() => setCreatedSuccessfully(false), 500);
    })
    .catch(error => {
      const message = error.response && error.response.data.errorMessage || t('ipAddresses.createFailed');
      setNotification({visible: true, message});
    });
  };

  const createIpAddressButton = Auth.connectedUserHasPermission(resourcesScopes.ipAddresses.create) && (
    <OpenTplDialButton
      key={'create-ip-address-' + createdSuccessfully}
      title={t('ipAddresses.create')}
      headers={[
        {id: 'ipAddress', label: t('ipAddresses.ipAddress')},
        {id: 'port', label: t('ipAddresses.port')},
        {id: 'status', label: t('ipAddresses.status'), type: 'enum', values: ipAddressesStatusForCreation},
        {id: 'activity', label: t('ipAddresses.activity'), type: 'enum', values: ipAddressesActivity.filter(a => !!a.key)},
        {id: 'offerType', label: t('ipAddresses.offerType'), type: 'enum', values: ipAddressOfferTypes},
        {id: 'comment', label: t('ipAddresses.comment')},
        {id: 'domain', label: t('ipAddresses.domain')},
      ]}
      confirmProps={{icon: <AddIcon />, label: t('create')}}
      cancelProps={{icon: <CancelIcon />, label: t('cancel')}}
      showProps={{icon: <AddIcon />, label: t('ipAddresses.create')}}
      dialogProps={{fullWidth: true, maxWidth: 'sm'}}
      onConfirm={createIpAddress}
      autocloseOnConfirm={false}
      closed={createdSuccessfully}
    />
  );

  return (
    <PageBase title={t('ipAddresses.title')} navigation={t('ipAddresses.navigation')} actionButton={createIpAddressButton} subMenu={dropdownMenu}>
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error && (
        <TplEnhancedTable pageable
                          rows={list.data}
                          headers={populateEntityConfiguration(ipAddressesFields)}
                          rowMapper={rowMapper}
                          paginationDefault={{number: Number(filters.page), size: Number(filters.size), totalElements}}
                          onPageChange={handlePageChange}
                          filterable
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

IpAddressesManagerPage.propTypes = {};

export default IpAddressesManagerPage;
