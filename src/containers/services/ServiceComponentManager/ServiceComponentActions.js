import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DialogContentText, Snackbar } from '@material-ui/core';
import { Assignment, Cancel, Delete, Edit, History } from '@material-ui/icons';
import { TplActionButton, TplEnhancedDialog } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { Auth } from '../../../services/Auth';
import {excludeFieldByDependency, populateEntityConfiguration} from '../../../helpers/entityHelper';
import { serviceComponentFields } from '../../../config/service/serviceComponent/serviceComponentFields';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import ServiceComponentUpdateWizard from './ServiceComponentUpdateWizard';
import { ROUTES } from '../../../config/routes';
import TecrepServiceAccessService from '../../../services/services/TecrepServiceAccessService';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import TecrepServiceService from '../../../services/services/TecrepServiceService';

const buildHeaders = () => populateEntityConfiguration(serviceComponentFields);

export const ServiceComponentActions = (props) => {
  const {item, infoPage, onServiceUpdate} = props;
  const [notification, setNotification] = useState({visible: false, message: ''});

  if (!item) {
    return null;
  }

  const headers = buildHeaders();

  const editService = itemConfirm => {
    TecrepServiceAccessService.editAccessService(itemConfirm)
    .then(onServiceUpdate)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const deleteService = itemConfirm => {
    TecrepServiceService.deleteService(itemConfirm)
    .then(onServiceUpdate)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  return (
    <div>
      {!infoPage && <TplActionButton tooltipTitle={t('detail')} icon={<Assignment />} link={ROUTES.serviceInfo.path.replace(':serviceId', item.serviceId)} />}
      <TplActionButton tooltipTitle={t('historic.title')} icon={<History />} link={ROUTES.historic.path.replace(':entity', 'service').replace(':id', item.serviceId)} />
      {Auth.connectedUserHasPermission(resourcesScopes.serviceComponent.update) &&
      <TplEnhancedDialog
        tooltipTitle={t('edit')}
        key={`edit-service-${item.serviceId}`}
        title={t('service.component.edit', item.crmServiceId, item.customerNo)}
        headers={excludeFieldByDependency(headers.filter(h => h.editable), item, "techId", {accessType: ['FREEDHOME']})}
        initialValues={item}
        cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
        confirmProps={{label: t('edit'), icon: <Edit />, name: 'confirm_edit'}}
        showProps={{icon: <Edit />, name: 'edit'}}
        onConfirm={editService}
        autocloseOnConfirm={true}
      />}
      {Auth.connectedUserHasPermission(resourcesScopes.serviceComponent.update) && (
        <ServiceComponentUpdateWizard onUpdate={onServiceUpdate} serviceComponent={item} />
      )}
      {!infoPage && Auth.connectedUserHasPermission(resourcesScopes.serviceComponent.delete) &&
      <TplEnhancedDialog
        tooltipTitle={t('delete')}
        key={`delete-service-${item.serviceId}`}
        title={t('service.component.delete')}
        initialValues={item}
        cancelProps={{label: t('cancel'), icon: <Cancel />}}
        confirmProps={{label: 'Delete', icon: <Delete />}}
        showProps={{icon: <Delete color="error" />, name: 'delete'}}
        onConfirm={deleteService}
      >
        <DialogContentText>
          {t('service.component.ask.delete', item.crmServiceId, item.customerNo)}
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

ServiceComponentActions.propTypes = {
  item: PropTypes.object,
  infoPage: PropTypes.boolean,
  onServiceUpdate: PropTypes.func.isRequired,
};
