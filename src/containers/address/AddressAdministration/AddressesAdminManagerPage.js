import React, { useState } from 'react';
import { t } from 'mt-react-library/functions';
import PageBase from '../../../components/PageBase';
import DropdownMenu from '../../../components/DropdownMenu';
import { MenuItem, Snackbar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Auth } from '../../../services/Auth';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { ErrorAlert } from '../../../components/ErrorAlert';
import TecrepStreetService from '../../../services/address/TecrepStreetService';
import { streetsHeader } from '../../../config/adresses/postalAddress/adressesAdministration';
import { Add, Cancel } from '@material-ui/icons';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { StreetActions } from './StreetActions';
import { useUrlForm } from '../../../hooks/useUrlForm';
import { useSearchList } from '../../../hooks/useSearchList';
import { SearchEntities } from '../../../helpers/SearchEntities';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';

const AddressesAdminManagerPage = () => {
  const {filters, setFilters, ready, reset} = useUrlForm();
  const {list, fetch, totalElements, handlePageChange} = useSearchList({filters, setFilters, entity: SearchEntities.streets, isFilterReady: ready});
  const [notification, setNotification] = useState({show: false, message: ''});
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);

  const addStreet = street => {
    TecrepStreetService
    .addStreet(street)
    .then(() => {
      fetch();
      setCreatedSuccessfully(true);
      setNotification({show: true, message: t('street.added.success')});
      setTimeout(() => setCreatedSuccessfully(false), 500);
    })
    .catch(err => setNotification({show: true, message: getErrorMessage(err)}));
  };

  const editStreet = street => {
    TecrepStreetService
    .editStreet(street)
    .then(() => {
      fetch();
      setNotification({show: true, message: t('street.edited.success')});
    })
    .catch(errorEdit => setNotification({show: true, message: getErrorMessage(errorEdit)}));
  };

  const deleteStreet = streetId => {
    TecrepStreetService.deleteStreet(streetId)
    .then(() => {
      fetch();
      setNotification({show: true, message: t('street.deleted.success')});
    })
    .catch(errorDelete => setNotification({show: true, message: getErrorMessage(errorDelete.message)}));
  };

  const streetsRowMapper = row => {
    const actions = <StreetActions street={row} handleEdit={editStreet} handleDelete={deleteStreet} />;
    return [{...row, actions}, {}];
  };

  const submenu = (
    <DropdownMenu>
      {() => {
        const submenuItems = [];
        if (Auth.connectedUserHasPermission(resourcesScopes.addressAdmin.update)) {
          submenuItems.push(<MenuItem key="import" component={Link} to="/importer/addressAdmin/import">{t('import.from.file')}</MenuItem>);
        }
        return submenuItems;
      }}
    </DropdownMenu>
  );

  const addActionButton = Auth.connectedUserHasPermission(resourcesScopes.address.create) &&
    <OpenTplDialButton title={t('add')}
                       key={'add-street-' + createdSuccessfully}
                       headers={streetsHeader.filter(h => h.addable)}
                       confirmProps={{label: t('add'), icon: <Add />, name: 'confirm_add'}}
                       cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
                       showProps={{icon: <Add />, label: t('add'), name: 'add'}}
                       onConfirm={addStreet}
                       autocloseOnConfirm={false}
                       closed={createdSuccessfully}
    />;

  const handleFilterChange = filterChange => setFilters({...filterChange, page: 0});

  return (
    <PageBase navigation={t('addressAdmin.navigation')} title={t('addressAdmin.title')} subMenu={submenu} actionButton={addActionButton}>
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error && (
        <TplEnhancedTable rows={list.data}
                          headers={streetsHeader}
                          rowMapper={streetsRowMapper}
                          pageable
                          filterable
                          paginationDefault={{number: Number(filters.page), size: Number(filters.size), totalElements}}
                          onPageChange={handlePageChange}
                          filterDefault={filters}
                          onFilterChange={handleFilterChange}
                          headerFreeContent={<ResetFilterButton onClick={reset} />}
        />)}
      <Snackbar
        open={notification.show}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({show: false, message: ''})}
      />
    </PageBase>
  );
};

export default AddressesAdminManagerPage;
