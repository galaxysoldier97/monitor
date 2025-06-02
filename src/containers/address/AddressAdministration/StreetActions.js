import React from 'react';
import PropTypes from 'prop-types';
import { t } from 'mt-react-library/functions';
import { Assignment, Cancel, Delete, Edit } from '@material-ui/icons';
import { TplEnhancedDialog, TplActionButton } from 'mt-react-library/containers/templates';
import { DialogContentText } from '@material-ui/core';
import { routePaths } from '../../../config/routes';
import { Auth } from '../../../services/Auth';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { streetsHeader } from '../../../config/adresses/postalAddress/adressesAdministration';

export const StreetActions = ({street, handleEdit, handleDelete}) => {

  const editDialog = <TplEnhancedDialog
    tooltipTitle={t('edit')}
    title={t('addressAdmin.editStreet', street.streetName)}
    headers={streetsHeader.filter(h => h.addable)}
    initialValues={street}
    confirmProps={{label: t('edit'), icon: <Edit />, name: 'edit'}}
    cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
    showProps={{icon: <Edit />, name: 'edit'}}
    onConfirm={itemConfirm => handleEdit(itemConfirm)}
    autocloseOnConfirm
  />;

  const deleteDialog = <TplEnhancedDialog
    tooltipTitle={t('delete')}
    title={t('addressAdmin.street.delete', street.streetName)}
    initialValues={street}
    confirmProps={{label: t('delete'), icon: <Delete />}}
    cancelProps={{label: t('cancel'), icon: <Cancel />}}
    showProps={{icon: <Delete color="error" />}}
    onConfirm={() => handleDelete(street.streetId)}
  >
    <DialogContentText>
      {t('addressAdmin.street.delete.ask', <strong>{street.streetName}</strong>)}
    </DialogContentText>
  </TplEnhancedDialog>;

  return (
    <div style={{whiteSpace: 'nowrap'}}>
      <TplActionButton tooltipTitle={t('detail')}
                       icon={<Assignment />}
                       name="detail"
                       link={`${routePaths.street}/${street.streetId}`}
      />
      {Auth.connectedUserHasPermission(resourcesScopes.address.update) && editDialog}
      {Auth.connectedUserHasPermission(resourcesScopes.address.delete) && deleteDialog}
    </div>
  );
};

StreetActions.propTypes = {
  street: PropTypes.object,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};
