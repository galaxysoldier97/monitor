import { PinBlackMarker, PinGreenMarker, PinOrangeMarker } from 'leaflet-color-markers/src/leaflet-color-markers';

export const getIconForStatus = (horDeployStatus, verDeployStatus) => {
  if (horDeployStatus === 'PROJECT_STARTED' && verDeployStatus === 'PROJECT_STARTED') {
    return PinBlackMarker;
  } else if (horDeployStatus === 'DEPLOYMENT_CONNECTED' && verDeployStatus === 'DEPLOYMENT_DONE') {
    return PinGreenMarker;
  } else {
    return PinOrangeMarker;
  }
};

export const isLocationDisplayable = location =>
  location.latitude && location.latitude >= -90.0 && location.latitude <= 90.0
  && location.longitude && location.longitude >= -90.0 && location.longitude <= 90.0;
