import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import { t } from 'mt-react-library/functions';
import { TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { addressesHeader } from '../../../config/adresses/postalAddress/adressesAdministration';
import TecrepAddressService from '../../../services/address/TecrepAddressService';
import { ErrorAlert } from '../../../components/ErrorAlert';
import PageBase from '../../../components/PageBase';
import { Auth } from '../../../services/Auth';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { Add, Cancel } from '@material-ui/icons';
import { AddressActions } from './AddressActions';
import TecrepBuildingService from '../../../services/address/TecrepBuildingService';
import { ResetFilterButton } from '../../../components/buttons/ResetFilterButton';
import { getErrorMessage } from '../../../helpers/fetchHelper';

export const StreetAddressDetailsPage = ({streetId}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [addresses, setAddresses] = useState();
  const [pagination, setPagination] = useState({number: 0, size: 10, totalElements: 0});
  const [notification, setNotification] = useState({show: false, message: ''});
  const [filter, setFilter] = useState({streetNumber: '', streetQualifier: '', sectorName: '', latitude: '', longitude: ''});

  const handleFilterChange = filterChange => {
    setFilter(filterChange);
    setPagination({number: 0, size: 10, totalElements: 0});
  };

  const fetchAddresses = () => {
    TecrepAddressService.searchAddresses(pagination.number, pagination.size, {...filter, streetId})
    .then(response => {
      setAddresses(response._embedded ? response._embedded.addresses : []);
      setPagination({...pagination, totalElements: response.page.totalElements});
    })
    .catch((e) => setError(e))
    .finally(() => setLoading(false));
  };

  useEffect(fetchAddresses, [pagination.size, pagination.number, filter]);

  const editAddress = address => {
    TecrepAddressService
    .editAddress(address)
    .then(() => {
      fetchAddresses();
      setNotification({show: true, message: t('address.edited.success')});
    })
    .catch(errorEdit => setNotification({show: true, message: getErrorMessage(errorEdit)}));
  };

  const deleteAddress = addressId => {
    TecrepAddressService
    .deleteAddress(addressId)
    .then(() => {
      fetchAddresses();
      setNotification({show: true, message: t('address.deleted.success')});
    })
    .catch(errorDelete => setNotification({show: true, message: getErrorMessage(errorDelete)}));
  };

  const addABuilding = (building, addressId) => {
    TecrepBuildingService
    .addBuilding(building, addressId)
    .then(() => {
      setNotification({show: true, message: t('building.added.success')});
    })
    .catch(errorAdd => setNotification({show: true, message: getErrorMessage(errorAdd)}));
  };

  const addressRowMapper = row => {
    const actions = <AddressActions address={row} handleEdit={editAddress} handleDelete={deleteAddress} addABuilding={addABuilding} />;
    return [{...row, actions}, {}];
  };

  const addAddress = address => {
    TecrepAddressService
    .addAddress(address, streetId)
    .then(() => {
      fetchAddresses();
      setNotification({show: true, message: t('address.added.success')});
    })
    .catch(errorAdd => setNotification({show: true, message: getErrorMessage(errorAdd)}));
  };

  const addActionButton = Auth.connectedUserHasPermission(resourcesScopes.address.create) &&
    <OpenTplDialButton title={t('add')}
                       headers={addressesHeader.filter(h => h.addable)}
                       confirmProps={{label: t('add'), icon: <Add />, name: 'confirm_add'}}
                       cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
                       showProps={{icon: <Add />, label: t('add'), name: 'add'}}
                       onConfirm={address => addAddress(address)}
                       autocloseOnConfirm
    />;

  return (
    <PageBase title={t('street.address.title')} actionButton={addActionButton}>
      {error && <ErrorAlert message={error} />}
      {loading && !error && <TplLoading />}
      {!loading && !error && (
        <TplEnhancedTable rows={addresses}
                          headers={addressesHeader}
                          rowMapper={addressRowMapper}
                          pageable
                          controlled
                          filterable
                          filterDefault={filter}
                          onFilterChange={handleFilterChange}
                          paginationDefault={pagination}
                          onPageChange={setPagination}
                          headerFreeContent={<ResetFilterButton onClick={() => handleFilterChange({})} />}
        />)
      }
      <Snackbar
        open={notification.show}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({show: false, message: ''})}
      />
    </PageBase>
  );
};

StreetAddressDetailsPage.propTypes = {
  streetId: PropTypes.string,
};
