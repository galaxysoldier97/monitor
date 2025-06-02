import {t} from 'mt-react-library/functions';
import React, { PropTypes, useState } from 'react';
import {TplActionButton, TplEnhancedDialog} from 'mt-react-library/containers/templates';
import {Assignment, Cancel, Delete, Edit, History} from '@material-ui/icons';
import {Auth} from '../../../services/Auth';
import {Checkbox, Typography, FormControlLabel, Snackbar, DialogContent} from '@material-ui/core';
import {buildCPEHeaders} from './CPEManagerPage';
import {resourcesScopes} from '../../../config/resources/resourcesScopes';
import CPEUpdateWizard from "./CPEUpdateWizard";
import { ROUTES } from '../../../config/routes';
import { useHistory } from 'react-router-dom';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepCpeService from '../../../services/equipments/TecrepCpeService';
import { editableEntity, mapItemToEditForm } from '../../../helpers/entityHelper';
import { useFetchWarehouses } from '../../../hooks/useFetchWarehouses';

export const CPEActions = ({filteredCpe, mapped, onActionPerformed}) => {
  const headers = buildCPEHeaders();
  const [forceDeletion, setForceDeletion] = useState(false);
  const [notification, setNotification] = useState({visible: false, message: ''});
  const history = useHistory();
  const {warehouses} = useFetchWarehouses();

  if (!mapped) {
    return null;
  }

  const edit = item => {
    TecrepCpeService.editCPE(item)
    .then(onActionPerformed)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const deleteCpe = item => {
    TecrepCpeService.deleteCPE(item, forceDeletion)
    .then(() => {
      if (filteredCpe) {
        history.push(ROUTES.cpeManager.path);
      } else {
        onActionPerformed();
      }
    })
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  return (
    <div>
      {!filteredCpe && <TplActionButton tooltipTitle={t('detail')} name="detail" icon={<Assignment/>}
                                        link={ROUTES.cpeInfo.path.replace(':equipmentId', mapped.id)}/>}
      <TplActionButton tooltipTitle={t('historic.title')} name="historic" icon={<History/>}
                       link={ROUTES.historic.path.replace(':entity', 'cpe').replace(':id', mapped.id)} />
      {Auth.connectedUserHasPermission(resourcesScopes.cpe.update) &&
        <TplEnhancedDialog
          key={`update-cpe-${mapped.id}`}
          title={t('cpe.edit', mapped.serialNumber, mapped.imsiNumber)}
          headers={headers.filter(h => h.editable)}
          initialValues={mapItemToEditForm(mapped, warehouses, editableEntity.warehouse)}
          confirmProps={{label: t('edit'), icon: <Edit/>, name: 'edit'}}
          cancelProps={{label: t('cancel'), icon: <Cancel/>, name: 'cancel'}}
          showProps={{icon: <Edit/>, name: 'edit'}}
          onConfirm={edit}
          autocloseOnConfirm={false}
          tooltipTitle={t('edit')}
        />}
      {Auth.connectedUserHasPermission(resourcesScopes.cpe.update) &&
        <CPEUpdateWizard cpe={mapped} onUpdate={onActionPerformed} />}
      {!filteredCpe && Auth.connectedUserHasPermission(resourcesScopes.cpe.delete) &&
        <TplEnhancedDialog
          title={t('cpe.delete')}
          initialValues={mapped}
          confirmProps={{label: t('cpe.delete'), icon: <Delete/>}}
          cancelProps={{label: t('cancel'), icon: <Cancel/>}}
          showProps={{icon: <Delete color="error"/>}}
          onConfirm={deleteCpe}
          tooltipTitle={t('delete')}
        >
          <DialogContent>
            <Typography>{t('cpe.delete.ask', <strong>{mapped.serialNumber}</strong>)}</Typography>
            <FormControlLabel control={<Checkbox name="forceDeletion" value={forceDeletion} onChange={e => setForceDeletion(e.target.checked)}/>} label={t('cpe.delete.ask.force')} />
          </DialogContent>
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

CPEActions.propTypes = {
  onActionPerformed: PropTypes.func,
  filteredCpe: PropTypes.object,
  mapped: PropTypes.object,
};

