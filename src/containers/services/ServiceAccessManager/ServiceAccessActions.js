import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, DialogContent, FormControlLabel, Snackbar, Typography } from '@material-ui/core';
import { Assignment, Cancel, Delete, Edit, History } from '@material-ui/icons';
import { TplActionButton, TplEnhancedDialog } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { Auth } from '../../../services/Auth';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import {excludeFieldByDependency, populateEntityConfiguration} from '../../../helpers/entityHelper';
import { serviceAccessFields } from '../../../config/service/serviceAccess/serviceAccessFields';
import ServiceAccessUpdateWizard from './ServiceAccessUpdateWizard';
import { ROUTES } from '../../../config/routes';
import TecrepServiceAccessService from '../../../services/services/TecrepServiceAccessService';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepServiceService from '../../../services/services/TecrepServiceService';

export const buildHeaders = () => populateEntityConfiguration([...serviceAccessFields]);

export const ServiceAccessActions = (props) => {
  const {item, infoPage, onServiceUpdate} = props;
  const headers = buildHeaders();
  const [forceDeletion, setForceDeletion] = useState(false);
  const [notification, setNotification] = useState({visible: false, message: ''});

  if (!item) {
    return null;
  }

  const editService = itemConfirm => {
    TecrepServiceAccessService.editAccessService(itemConfirm)
    .then(onServiceUpdate)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const deleteService = itemConfirm => {
    TecrepServiceService.deleteService(itemConfirm, forceDeletion || undefined)
    .then(onServiceUpdate)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  return (
    <div>
      {!infoPage && <TplActionButton tooltipTitle={t('detail')} icon={<Assignment />} link={ROUTES.serviceInfo.path.replace(':serviceId', item.serviceId)} />}
      <TplActionButton tooltipTitle={t('historic.title')} icon={<History />} link={ROUTES.historic.path.replace(':entity', 'service').replace(':id', item.serviceId)} />
      {Auth.connectedUserHasPermission(resourcesScopes.serviceAccess.update) && (
        <TplEnhancedDialog
          tooltipTitle={(t('edit'))}
          key={`edit-service-${item.equipmentId}`}
          title={t('service.access.edit', item.crmServiceId, item.customerNo)}
          headers={excludeFieldByDependency(headers.filter(h => h.editable), item, "techId", {accessType: ['FREEDHOME']})}
          initialValues={item}
          cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
          confirmProps={{label: t('edit'), icon: <Edit />, name: 'confirm_edit'}}
          showProps={{icon: <Edit />, name: 'edit'}}
          onConfirm={editService}
          autocloseOnConfirm={true}
        />
      )}
      {Auth.connectedUserHasPermission(resourcesScopes.serviceAccess.update) && (
        <ServiceAccessUpdateWizard onUpdate={onServiceUpdate} serviceAccess={item} />
      )}
      {!infoPage && Auth.connectedUserHasPermission(resourcesScopes.serviceAccess.delete) && (
        <TplEnhancedDialog
          tooltipTitle={(t('delete'))}
          key={`delete-service-${item.equipmentId}`}
          title={t('service.access.delete')}
          initialValues={item}
          cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
          confirmProps={{label: t('service.access.delete'), icon: <Delete />, name: 'confirm_delete'}}
          showProps={{icon: <Delete color="error" />, name: 'delete'}}
          onConfirm={deleteService}
        >
          <DialogContent>
            <Typography>{t('service.access.ask.delete', <strong>{item.crmServiceId}</strong>, <strong>{item.customerNo}</strong>)}</Typography>
            <FormControlLabel control={<Checkbox name="forceDeletion" value={forceDeletion} onChange={e => setForceDeletion(e.target.checked)}/>} label={t('service.access.ask.deleteForce')} />
          </DialogContent>
        </TplEnhancedDialog>
      )}
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </div>
  );
};

ServiceAccessActions.propTypes = {
  item: PropTypes.object,
  infoPage: PropTypes.boolean,
  onServiceUpdate: PropTypes.func.isRequired,
};

