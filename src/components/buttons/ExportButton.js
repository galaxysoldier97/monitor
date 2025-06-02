import React, { useState } from 'react';
import { IconButton, Snackbar, Tooltip } from '@material-ui/core';
import { t } from 'mt-react-library/functions';
import GetAppIcon from '@material-ui/icons/GetApp';
import TecrepSimCardService from '../../services/equipments/TecrepSimCardService';
import { getErrorMessage } from '../../helpers/fetchHelper';
import CircularProgress from '@material-ui/core/CircularProgress';
import TecrepCpeService from '../../services/equipments/TecrepCpeService';
import TecrepAncillaryEquipmentsService from '../../services/equipments/TecrepAncillaryEquipmentsService';
import { getCurrentDate, downloadExcelContent } from '../../helpers/exportHelper';
import PropTypes from "prop-types";

export const exportableEntity = Object.freeze({
  simcards: 'simcards',
  cpe: 'cpe',
  ancillaryEquipments: 'ancillaryEquipments'
});

const getExportFunction = (entity, filters) => {
  switch (entity) {
    case exportableEntity.simcards:
      return TecrepSimCardService.exportSimCards(filters);
    case exportableEntity.cpe:
      return TecrepCpeService.exportCpe(filters);
    case exportableEntity.ancillaryEquipments:
      return TecrepAncillaryEquipmentsService.exportAncillaryEquipments(filters);
  }
};
export const ExportButton = ({entity, filters}) => {
  const [notification, setNotification] = useState({visible: false, message: ''});
  const [isDownloading, setIsDownloading] = useState(false);
  const download = () => {
    setIsDownloading(true);
    getExportFunction(entity, filters)
    .then(r => downloadExcelContent(r.data, `${entity}-${getCurrentDate().replaceAll(':','_')}`))
    .catch(err => setNotification({visible: true, message: getErrorMessage(err)}))
    .finally(() => setIsDownloading(false));
  };

  return (
    <React.Fragment>
      {isDownloading ? <CircularProgress color="primary" size={20} /> :
        <Tooltip title={t('export')} onClick={download}>
        <IconButton size="small"><GetAppIcon /></IconButton>
      </Tooltip>}
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </React.Fragment>
  );
};
ExportButton.propTypes = {
  filters: PropTypes.object,
  entity: PropTypes.object,
};
