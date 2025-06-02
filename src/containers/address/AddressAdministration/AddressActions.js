import React from 'react';
import PropTypes from 'prop-types';
import { t } from 'mt-react-library/functions';
import { Add, Cancel, Delete, Edit } from '@material-ui/icons';
import { TplEnhancedDialog } from 'mt-react-library/containers/templates';
import { DialogContentText } from '@material-ui/core';
import { Auth } from '../../../services/Auth';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { addressesHeader } from '../../../config/adresses/postalAddress/adressesAdministration';
import { getAddressDescription } from '../../../helpers/commonHelper';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import { buildingFields } from '../../../config/adresses/postalAddress/buildingFields';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';

export const AddressActions = ({address, handleEdit, handleDelete, addABuilding}) => {

  const editDialog = <TplEnhancedDialog
    tooltipTitle={t('edit')}
    title={t('addressAdmin.editAddress', getAddressDescription(address))}
    headers={addressesHeader.filter(h => h.addable)}
    initialValues={address}
    confirmProps={{label: t('edit'), icon: <Edit />, name: 'edit'}}
    cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
    showProps={{icon: <Edit />, name: 'edit'}}
    onConfirm={handleEdit}
    autocloseOnConfirm
  />;

  const deleteDialog = <TplEnhancedDialog
    tooltipTitle={t('delete')}
    title={t('addressAdmin.address.delete', getAddressDescription(address))}
    initialValues={address}
    confirmProps={{label: t('delete'), icon: <Delete />}}
    cancelProps={{label: t('cancel'), icon: <Cancel />}}
    showProps={{icon: <Delete color="error" />}}
    onConfirm={() => handleDelete(address.addressId)}
  >
    <DialogContentText>
      {t('addressAdmin.address.delete.ask', <strong>{getAddressDescription(address)}</strong>)}
    </DialogContentText>
  </TplEnhancedDialog>;

  const addBuildingButton = <TplEnhancedDialog tooltipTitle={t('building.add')}
                                               title={t('building.add')}
                                               headers={populateEntityConfiguration(buildingFields).filter(h => h.addable)}
                                               confirmProps={{label: t('add'), icon: <Add />, name: 'confirm_add'}}
                                               cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
                                               showProps={{icon: <LocationCityIcon />, name: 'add'}}
                                               onConfirm={building => addABuilding(building, address.addressId)}
                                               autocloseOnConfirm
  />;

  return (
    <div>
      {Auth.connectedUserHasPermission(resourcesScopes.address.update) && editDialog}
      {Auth.connectedUserHasPermission(resourcesScopes.address.create) && addBuildingButton}
      {Auth.connectedUserHasPermission(resourcesScopes.address.delete) && deleteDialog}
    </div>
  );
};

AddressActions.propTypes = {
  address: PropTypes.object,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  addABuilding: PropTypes.func,
};
