import React, { PropTypes, useState } from 'react';
import { TplLoading } from 'mt-react-library/containers/templates';
import { isLocationDisplayable, MapLegend, MapRenderer } from './Map';
import LocationMarker from './Map/locationMarker';
import { Snackbar } from '@material-ui/core';
import { ErrorAlert } from '../components/ErrorAlert';
import { useSearchList } from '../hooks/useSearchList';
import { SearchEntities } from '../helpers/SearchEntities';

const BuildingMapPage = ({center = {lat: 43.7384, lng: 7.4246}, minHeight = 500, maxZoom = 22, minZoom = 15, maxNativeZoom = 18}) => {
  //center is the center of Monaco according to Google maps
  const [notification, setNotification] = useState({visible: false, message: ''});
  const [filters, setFilters] = useState({size: 1000000, isEndpointPostalAddress: false});
  const {list} = useSearchList({filters, setFilters, entity: SearchEntities.postalAddresses});

  const buildings = list.data && list.data.map(l => {
    const building = l.building;
    building.horDeployStatus = building.buildingStatusDTOs[0] ? building.buildingStatusDTOs[0].horDeployStatus : null;
    building.verDeployStatus = building.buildingStatusDTOs[0] ? building.buildingStatusDTOs[0].verDeployStatus : null;
    return building;
  });

  const buildingsFilter = buildings && buildings.filter(isLocationDisplayable);

  return (
    <>
      {list.error && <ErrorAlert message={list.error} />}
      {list.loading && !list.error && <TplLoading />}
      {!list.loading && !list.error &&
        <MapRenderer center={center} minZoom={minZoom} maxZoom={maxZoom} maxNativeZoom={maxNativeZoom} minHeight={minHeight}>
          {buildingsFilter.map((location, index) => (
            <LocationMarker key={index} location={location} />))}
            <MapLegend />
            <Snackbar
              open={notification.visible}
              message={notification.message}
              autoHideDuration={4000}
              onClose={() => setNotification({...notification, visible: false})}
            />
        </MapRenderer>}
    </>
  );
};

BuildingMapPage.propTypes = {
  center: PropTypes.string,
  minHeight: PropTypes.string,
  maxZoom: PropTypes.string,
  minZoom: PropTypes.string,
  maxNativeZoom: PropTypes.string,
};
export default BuildingMapPage;
