import React, {PropTypes, useState} from 'react';
import { DialogContentText, Snackbar } from '@material-ui/core';
import { Assignment, Cancel, Delete, Edit, History, CropFree, SimCard } from '@material-ui/icons';
import { TplActionButton, TplEnhancedDialog } from 'mt-react-library/containers/templates';
import { Auth } from '../../../services/Auth';
import { t } from 'mt-react-library/functions';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { buildSimCardHeaders } from './SIMCardManagerPage';
import SimCardUpdateWizard from './SimCardUpdateWizard';
import { ROUTES } from '../../../config/routes';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepSimCardService from '../../../services/equipments/TecrepSimCardService';
import { useHistory } from 'react-router-dom';
import { editableEntity, mapItemToEditForm } from '../../../helpers/entityHelper';
import { useFetchWarehouses } from '../../../hooks/useFetchWarehouses';

export const SIMCardActions = ({filteredSim, mapped, onActionPerformed}) => {
  const headers = buildSimCardHeaders();
  const [notification, setNotification] = useState({visible: false, message: ''});
  const history = useHistory();
  const {warehouses} = useFetchWarehouses();

  if (!mapped) {
    return null;
  }

  const edit = item => {
    TecrepSimCardService.editSimCard(item)
    .then(onActionPerformed)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const deleteSimCard = item => {
    TecrepSimCardService.deleteSimCard(item)
    .then(() => {
      if (filteredSim) {
        history.push(ROUTES.simCardManager.path);
      } else {
        onActionPerformed();
      }
    })
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  return (
    <div>
      {!filteredSim && <TplActionButton tooltipTitle={t('detail')} icon={<Assignment />} link={ROUTES.simCardInfo.path.replace(':equipmentId', mapped.id)} />}
      <TplActionButton tooltipTitle={t('historic.title')} icon={<History />} link={ROUTES.historic.path.replace(':entity', 'simcard').replace(':id', mapped.id)} />
      {Auth.connectedUserHasPermission(resourcesScopes.simCard.update) &&
      <TplEnhancedDialog
        tooltipTitle={(t('edit'))}
        key={`update-sim-${mapped.id}`}
        title={t('simcard.edit', mapped.serialNumber, mapped.imsiNumber)}
        headers={headers.filter(h => h.editable)}
        initialValues={mapItemToEditForm(mapped, warehouses, editableEntity.warehouse)}
        confirmProps={{label: t('edit'), icon: <Edit />, name: 'edit'}}
        cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
        showProps={{icon: <Edit />, name: 'edit'}}
        onConfirm={edit}
        autocloseOnConfirm={false}
      />}
      {Auth.connectedUserHasPermission(resourcesScopes.simCard.update) && (
        <SimCardUpdateWizard simCard={mapped} onUpdate={onActionPerformed} />
      )}
      {mapped?.esim && mapped?.qrCode &&
        <TplEnhancedDialog
          tooltipTitle={t("qrCode")}
          title={t("qrCode")}
          showProps={{icon: <CropFree/>}}
          cancelProps={{}}
        >
          <img style={{padding: "0px 30px 0px 30px", height: "300px", width: "auto", marginTop: "-20px"}} src={`data:image/png;base64,${mapped.qrCode}`} alt="QrCode"/>
        </TplEnhancedDialog>
      }
      {mapped?.esim && filteredSim && <TplActionButton tooltipTitle={t('Notification eSIM')} icon={<SimCard />} link={ROUTES.eSimNotification.path.replace(':equipmentId', mapped.id)} />}
      {!filteredSim && Auth.connectedUserHasPermission(resourcesScopes.simCard.delete) &&
      <TplEnhancedDialog
        tooltipTitle={t('delete')}
        title={t('simcard.delete')}
        initialValues={mapped}
        confirmProps={{label: t('simcard.delete'), icon: <Delete />}}
        cancelProps={{label: t('cancel'), icon: <Cancel />}}
        showProps={{icon: <Delete color="error"/>}}
        onConfirm={deleteSimCard}
      >
        <DialogContentText>
          {t('simcard.delete.ask', <strong>{mapped.serialNumber}</strong>, <strong>{mapped.imsiNumber}</strong>)}
        </DialogContentText>
      </TplEnhancedDialog>}
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </div>
  );
};

SIMCardActions.propTypes = {
  mapped: PropTypes.object,
  filteredSim: PropTypes.object,
  onActionPerformed: PropTypes.func
};

