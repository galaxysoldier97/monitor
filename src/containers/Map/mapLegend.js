import React from 'react';
import Control from 'react-leaflet-control';
import { t } from 'mt-react-library/functions';
import '../../css/map-legend.css';
import { injectIntl } from 'react-intl';

const MapLegend = () => (<Control>
  <div className="my-legend">
    <div className="legend-scale">
      <ul className="legend-labels">
        <li>
          <div style={{background: 'black'}} />
          {t('dictionary.DeploymentStatus.projectStarted')}</li>
        <li>
          <div style={{background: 'orange'}} />
          {t('dictionary.DeploymentStatus.deploymentStarted')}</li>
        <li>
          <div style={{background: 'green'}} />
          {t('dictionary.DeploymentStatus.deploymentDone')}</li>
      </ul>
    </div>
  </div>
</Control>);

export default injectIntl(MapLegend);
