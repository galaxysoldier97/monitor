import { getIconForStatus } from './function';
import { Marker, Popup } from 'react-leaflet';
import React, { PropTypes, useState } from 'react';
import { t } from 'mt-react-library/functions';
import Fab from '@material-ui/core/Fab/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import Switch from '@material-ui/core/Switch';
import TecrepBuildingService from '../../services/address/TecrepBuildingService';
import TecRepBuildingRequestDtoGenerator from '../../services/address/TecRepBuildingRequestDtoGenerator';
import { getErrorMessage } from '../../helpers/fetchHelper';
import { Snackbar } from '@material-ui/core';

const LocationMarker = ({location}) => {
  const [draggable, setDraggable] = useState(false);
  const [longitude, setLongitude] = useState(location.longitude);
  const [latitude, setLatitude] = useState(location.latitude);
  const [notification, setNotification] = useState({visible: false, message: ''});

  const handleChange = event => setDraggable(event.target.checked);

  const updateBuilding = event => {
    const latLng = event.target.getLatLng();
    let update = location;
    update.latitude = latLng.lat;
    update.longitude = latLng.lng;
    setLatitude(latLng.lat);
    setLongitude(latLng.lng);
    TecrepBuildingService.updateBuilding(TecRepBuildingRequestDtoGenerator.prepareForUpdateBuilding(update))
    .then(() => {
      setDraggable(false);
      setNotification({visible: true, message: t('building.update.success')});
    })
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  return (
    <>
      <Marker draggable={draggable}
              key={`${location.buildingCode}-${location.latitude}-${location.longitude}`}
              position={[latitude, longitude]}
              onDragend={updateBuilding}
              icon={getIconForStatus(location.horDeployStatus, location.verDeployStatus)}
      >
        <Popup>
          <div>
            <h2>{`${location.buildingCode} (${location.buildingName})`}</h2>
            <div>{t('locations.map.update')}<Switch checked={draggable} onChange={handleChange} value="checkedA" inputProps={{'aria-label': 'primary checkbox'}} /></div>
            <div><b>{t('locations.list.horDeployStatus')}</b> : {t('dictionary.HorDeployStatus.' + location.horDeployStatus)}<br /><b>{t('locations.list.verDeployStatus')}</b>: {t('dictionary.VerDeployStatus.' + location.verDeployStatus)}</div>
            <br />
            <br />
            <br />
            <br />
            <div>
              <Fab href={`/buildings/${location.buildingId}`} size="small" color="primary" variant="extended" aria-label="localisation">
                <NavigationIcon color="action" />
                <span style={{color: 'white'}}>{t('link.location.show')}</span>
              </Fab>
            </div>
          </div>
        </Popup>
      </Marker>
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </>);
};

LocationMarker.propTypes = {
  location: PropTypes.object
};

export default LocationMarker;
