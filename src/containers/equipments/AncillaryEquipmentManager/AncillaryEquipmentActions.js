import React, { PropTypes, useState } from 'react';
import { DialogContentText, Snackbar } from '@material-ui/core';
import { Assignment, Cancel, Delete, Edit, History } from '@material-ui/icons';
import { TplActionButton, TplEnhancedDialog } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { Auth } from '../../../services/Auth';
import { buildAncEqmHeaders } from './AncillaryEquipmentManagerPage';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import AncillaryEquipmentUpdateWizard from './AncillaryEquipmentUpdateWizard';
import { ROUTES } from '../../../config/routes';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepAncillaryEquipmentsService from '../../../services/equipments/TecrepAncillaryEquipmentsService';
import { editableEntity, mapItemToEditForm } from '../../../helpers/entityHelper';
import { useFetchWarehouses } from '../../../hooks/useFetchWarehouses';

export const AncillaryEquipmentActions = ({filteredEq, filteredDetail, mapped, onActionPerformed}) => {
  const [notification, setNotification] = useState({visible: false, message: ''});
  const {warehouses} = useFetchWarehouses();

  if (!mapped) {
    return null;
  }
  const edit = item => {
    TecrepAncillaryEquipmentsService.update(item)
    .then(onActionPerformed)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const deleteAncillaryEq = item => {
    TecrepAncillaryEquipmentsService.deleteAncillaryEquipment(item)
    .then(() => {
      if (filteredEq) {
        history.push(ROUTES.ancillaryEquipments.path);
      } else {
        onActionPerformed();
      }
    })
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  return (
    <div>
      {!filteredDetail && <TplActionButton tooltipTitle={t('detail')} name="detail" icon={<Assignment />}
                                           link={ROUTES.ancillaryEquipmentsInfo.path.replace(':equipmentId', mapped.id)} />}
      <TplActionButton tooltipTitle={t('historic.title')} name="historic" icon={<History />}
                       link={ROUTES.historic.path.replace(':entity', 'ancillaryEquipment').replace(':id', mapped.id)} />
      {Auth.connectedUserHasPermission(resourcesScopes.ancillaryEquipments.update) &&
        <TplEnhancedDialog
          key={`ancillary-update-${mapped.id}`}
          title={t('ancillaryEquipment.edit', mapped.serialNumber)}
          headers={buildAncEqmHeaders(filteredEq, mapped).filter(h => h.editable)}
          initialValues={mapItemToEditForm(mapped, warehouses, editableEntity.warehouse)}
          confirmProps={{label: t('edit'), icon: <Edit />, name: 'edit'}}
          cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
          showProps={{icon: <Edit />, name: 'edit'}}
          onConfirm={edit}
          autocloseOnConfirm={false}
          tooltipTitle={t('edit')}
        />}
      {Auth.connectedUserHasPermission(resourcesScopes.ancillaryEquipments.update) &&
        <AncillaryEquipmentUpdateWizard onUpdate={onActionPerformed} equipment={mapped} />}
      {!filteredEq && !filteredDetail && Auth.connectedUserHasPermission(resourcesScopes.ancillaryEquipments.delete) &&
        <TplEnhancedDialog
          title={t('ancillary.equipment.delete')}
          initialValues={mapped}
          confirmProps={{label: t('ancillary.equipment.delete'), icon: <Delete />}}
          cancelProps={{label: t('cancel'), icon: <Cancel />}}
          showProps={{icon: <Delete color="error" />}}
          onConfirm={deleteAncillaryEq}
          tooltipTitle={t('delete')}
        >
          <DialogContentText>
            {t('ancillary.equipment.delete.ask', <strong>{mapped.serialNumber}</strong>)}
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

AncillaryEquipmentActions.propTypes = {
  filteredEq: PropTypes.bool,
  filteredDetail: PropTypes.bool,
  mapped: PropTypes.object,
  onActionPerformed: PropTypes.func
};
