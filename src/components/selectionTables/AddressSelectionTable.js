import React, { PropTypes } from 'react';
import GenericSelectionTable from './GenericSelectionTable';
import { t } from 'mt-react-library/functions';
import TecrepBuildingService from '../../services/address/TecrepBuildingService';
import PostalAddressService from '../../services/address/PostalAddressService';

const addAddressHeaders = [
  {id: 'streetNumber', label: t('address.street.number'), type: 'number', editable: false, filterable: true},
  {
    id: 'streetQualifier', label: t('address.street.qualifier'), type: 'enum', values: [
      {key: '', value: '__'},
      {key: 'BIS', value: 'BIS'},
      {key: 'TER', value: 'TER'},
      {key: 'A', value: 'A'},
    ], editable: false, filterable: true,
  },
  {id: 'streetName', label: t('address.street.name'), type: 'string', editable: false, filterable: true},
  {id: 'sector', label: t('address.sector'), type: 'number', editable: false, filterable: true},
  {id: 'actions'},
];
const AddressSelectionTable = ({name, addressId, values, onChange}) => {
  const itemsFetcher = (filter, pagination) => {
    return TecrepBuildingService.searchAddress(filter.streetNumber, filter.streetQualifier, filter.streetName, filter.sector, pagination.number, pagination.size)
    .then(data => ({
      data: data._embedded ? data._embedded.addresses : [],
      totalElements: data.page.totalElements
    }));
  };

  return (
    <GenericSelectionTable
      name={name}
      itemsFetcher={itemsFetcher}
      itemFetcher={() => addressId && PostalAddressService.getPostalAddress(addressId)}
      itemIdentifier={item => item.addressId === addressId}
      tableHeader={addAddressHeaders}
      rowMapper={item => {
        let mapped = Object.assign({}, item);
        mapped.streetNumber = item ? item.streetNumber : null;
        mapped.streetQualifier = item ? item.streetQualifier : '__';
        mapped.streetName = item ? item.street.streetName : null;
        mapped.sector = item ? item.sector : null;
        return [mapped, {}];
      }}
      values={values}
      onChange={onChange}
    />
  );
};

AddressSelectionTable.propTypes = {
  name: PropTypes.string,
  addressId: PropTypes.string,
  values: PropTypes.object,
  onChange: PropTypes.func,
};

export default AddressSelectionTable;
