import React, { PropTypes } from 'react';
import Dimensions from 'react-dimensions';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer } from 'react-leaflet';
import 'react-leaflet-markercluster/dist/styles.min.css';
//https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMap = ({center, children, minZoom, maxZoom, minHeight, maxNativeZoom}) => (
  <Map
    className="markercluster-map"
    center={center}
    minZoom={minZoom}
    zoom={minZoom}
    maxZoom={maxZoom}
    style={{padding: 0, margin: 0, width: `100%`, height: `${window.innerHeight < minHeight ? minHeight : window.innerHeight}px`}}
  >
    <TileLayer
      maxNativeZoom={maxNativeZoom}
      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    />
    {children}
  </Map>
);

LocationMap.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number),
  children: PropTypes.object,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  minHeight: PropTypes.number,
  maxNativeZoom: PropTypes.number,
};

export default Dimensions()(LocationMap);
