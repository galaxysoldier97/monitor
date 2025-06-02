import React, { PropTypes } from 'react';
import TecrepAccessPointService from '../../services/services/TecrepAccessPointService';
import { serviceAccessPoint } from '../../config/service/serviceAccess/serviceAccessPoint';
import GenericSelectionTable from './GenericSelectionTable';

const AccessPointSelectionTable = ({accessPointId, values, onChange}) => {
  const itemsFetcher = (filter, pagination) => {
    return TecrepAccessPointService.search(filter, pagination.number, pagination.size)
      .then(data => ({
        data: data._embedded ? data._embedded.accessPointInstallationDToes : [],
        totalElements: data.page.totalElements
      }));
  };

  const rowMapper = item => {
    const mapped = {...item};
    mapped.blockNumber = item.pto && item.pto.buildingFlat ? item.pto.buildingFlat.blockNumber : null;
    mapped.floorNumber = item.pto && item.pto.buildingFlat ? item.pto.buildingFlat.floorNumber : null;
    mapped.flatNumber = item.pto && item.pto.buildingFlat ? item.pto.buildingFlat.flatNumber : null;
    mapped.ptoCode = item.pto ? item.pto.ptoCode : null;
    mapped.flatCode = item.pto && item.pto.buildingFlat ? item.pto.buildingFlat.flatCode : null;
    mapped.buildingName = item.pto && item.pto.buildingFlat && item.pto.buildingFlat.building ? item.pto.buildingFlat.building.buildingName : null;
    mapped.buildingCode = item.pto && item.pto.buildingFlat && item.pto.buildingFlat.building ? item.pto.buildingFlat.building.buildingCode : null;
    mapped.number = item.pto && item.pto.buildingFlat && item.pto.buildingFlat.building && item.pto.buildingFlat.building.postalAddressDTOs && item.pto.buildingFlat.building.postalAddressDTOs.length > 0 && item.pto.buildingFlat.building.postalAddressDTOs[0].address.streetNumber;
    mapped.qualifier = item.pto && item.pto.buildingFlat && item.pto.buildingFlat.building && item.pto.buildingFlat.building.postalAddressDTOs && item.pto.buildingFlat.building.postalAddressDTOs.length > 0 && item.pto.buildingFlat.building.postalAddressDTOs[0].address.streetQualifier;
    mapped.streetName = item.pto && item.pto.buildingFlat && item.pto.buildingFlat.building && item.pto.buildingFlat.building.postalAddressDTOs && item.pto.buildingFlat.building.postalAddressDTOs.length > 0 && item.pto.buildingFlat.building.postalAddressDTOs[0].address.street.streetName;
    return [mapped, {}];
  };

  return (
    <GenericSelectionTable
      name="accessPoint"
      itemsFetcher={itemsFetcher}
      itemFetcher={() => accessPointId && TecrepAccessPointService.getService(accessPointId)}
      itemIdentifier={accessPoint => accessPoint.accessPointId === accessPointId}
      tableHeader={serviceAccessPoint}
      rowMapper={rowMapper}
      values={values}
      onChange={onChange}
    />
  );
};

AccessPointSelectionTable.propTypes = {
  accessPointId: PropTypes.string,
  values: PropTypes.object,
  onChange: PropTypes.func,
};

export default AccessPointSelectionTable;
