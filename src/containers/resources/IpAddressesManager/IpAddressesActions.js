import React, { PropTypes, useState } from 'react';
import { DialogContentText, Snackbar } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import HistoryIcon from '@material-ui/icons/History';
import DeleteIcon from '@material-ui/icons/Delete';
import { TplActionButton, TplEnhancedDialog } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { useHistory } from 'react-router-dom';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { Auth } from '../../../services/Auth';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { ipAddressesFields } from '../../../config/resources/ipAddresses/ipAddressesFields';
import TecrepIpAddressesService from '../../../services/resources/TecrepIpAddressesService';
import { ROUTES } from '../../../config/routes';
import IpAddressUpdateWizard from './IpAddressUpdateWizard';
import {StepperProvider} from "../../../components/stepperForm/StepperContext";

export const IpAddressesActionsContent = ({ipAddress, afterEdit, infoPage}) => {

  const [notification, setNotification] = useState({visible: false, message: ''});
  const history = useHistory();

  if (!ipAddress) {
    return null;
  }

  const headers = populateEntityConfiguration(ipAddressesFields);

  const edit = (updatedIp) => {
    TecrepIpAddressesService.update(updatedIp)
      .then(afterEdit)
      .catch(e => {
        const message = e.response.data.message || e.response.data.errorMessage || e.response.data.error || t('error.title');
        setNotification({visible: true, message});
      });
  };

  const deleteIpAddress = ip => {
    TecrepIpAddressesService.delete(ip)
      .then(() => {
        if (infoPage) {
          history.push(ROUTES.ipAddressesManager.path);
        } else {
          afterEdit();
        }
      })
      .catch(e => {
        const message = e.response.data.message || e.response.data.errorMessage || e.response.data.error || t('ipAddresses.deleteError');
        setNotification({visible: true, message});
      });
  };

  return (
    <div>
      {!infoPage && <TplActionButton tooltipTitle={t('detail')} name="detail" icon={<AssignmentIcon />} link={ROUTES.ipAddressesInfo.path.replace(':ipAddressId', ipAddress.id)} />}
      <TplActionButton tooltipTitle={t('historic.title')} name="historic" icon={<HistoryIcon />} link={ROUTES.historic.path.replace(':entity', 'ipAddress').replace(':id', ipAddress.id)} />
      {Auth.connectedUserHasPermission(resourcesScopes.ipAddresses.edit) &&
        <TplEnhancedDialog
          key={`edit-ipAddress-${ipAddress.id}`}
          title={t('ipAddresses.edit', ipAddress.ipAddress)}
          headers={headers.filter(h => h.editable)}
          cancelProps={{label: t('cancel'), icon: <CancelIcon />}}
          initialValues={ipAddress}
          confirmProps={{label: t('edit'), icon: <EditIcon />, name: 'edit'}}
          showProps={{icon: <EditIcon />, name: 'edit'}}
          onConfirm={edit}
          autocloseOnConfirm={false}
          tooltipTitle={t('edit')}
        />}
      {Auth.connectedUserHasPermission(resourcesScopes.ipAddresses.edit) && (
          <StepperProvider>
            <IpAddressUpdateWizard ipAddress={ipAddress} onUpdate={afterEdit} />
          </StepperProvider>
      )}
      {Auth.connectedUserHasPermission(resourcesScopes.ipAddresses.delete) &&
        <TplEnhancedDialog
          tooltipTitle={t('delete')}
          title={t('ipAddresses.delete', ipAddress.ipAddress)}
          cancelProps={{label: t('cancel'), icon: <CancelIcon />}}
          confirmProps={{label: t('delete'), icon: <DeleteIcon />}}
          showProps={{icon: <DeleteIcon color="error" />}}
          onConfirm={() => deleteIpAddress(ipAddress)}
        >
          <DialogContentText>{t('ipAddresses.deleteMessage', ipAddress.ipAddress)}</DialogContentText>
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

IpAddressesActionsContent.propTypes = {
  ipAddress: PropTypes.object.isRequired,
  afterEdit: PropTypes.func.isRequired,
  infoPage: PropTypes.bool,
};

export const IpAddressesActions = IpAddressesActionsContent;
