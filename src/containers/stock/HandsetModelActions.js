import React, { PropTypes, useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Cancel, Delete, Edit } from '@material-ui/icons';
import { TplEnhancedDialog } from 'mt-react-library/containers/templates';
import { Auth } from '../../services/Auth';
import { t } from 'mt-react-library/functions';
import { resourcesScopes } from '../../config/resources/resourcesScopes';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { deleteHandsetModel, updateHandsetModel } from '../../services/Stock/StockManagementService';
import DialogContent from '@material-ui/core/DialogContent';


export const HandsetModelActions = ({mapped, headers, onUpdate}) => {
  const [notification, setNotification] = useState({show: false, message: ''});

  const updateItem = (oldItem, updatedItem) => {
    updateHandsetModel(oldItem.code, updatedItem)
    .then(onUpdate)
    .catch(err => {
      setNotification({show: true, message: t('errorOccurred', err.message)});
    });
  };

  const deleteItem = item => {
    deleteHandsetModel(item)
    .then(onUpdate)
    .catch(err => {
      setNotification({show: true, message: t('errorOccurred', err.message)});
    });
  };

  const canUpdate = Auth.connectedUserHasPermission(resourcesScopes.handset.update);
  const canDelete = Auth.connectedUserHasPermission(resourcesScopes.handset.delete);

  return (
    <Box minHeight="3em">
      <Grid container alignItems="center" wrap="nowrap">
        {canUpdate && (
          <Grid item>
            <TplEnhancedDialog
              title={t('edit')}
              headers={headers.filter(h => h.editable)}
              initialValues={mapped}
              confirmProps={{label: t('update'), icon: <Edit />}}
              cancelProps={{label: t('cancel'), icon: <Cancel />}}
              showProps={{icon: <Edit />, name: 'edit'}}
              onConfirm={updated => updateItem(mapped, updated)}
              dialogProps={{fullWidth: true, maxWidth: 'sm'}}
              autocloseOnConfirm={false}
              tooltipTitle={t('edit')}
            />
          </Grid>
        )}
        {canDelete && (
          <Grid item>
            <TplEnhancedDialog
              title={t('delete')}
              confirmProps={{label: t('delete'), icon: <Delete />}}
              cancelProps={{label: t('cancel'), icon: <Cancel />}}
              showProps={{icon: <Delete color="error" />}}
              onConfirm={() => deleteItem(mapped)}
              dialogProps={{fullWidth: true, maxWidth: 'sm'}}
              autocloseOnConfirm
              tooltipTitle={t('delete')}
            >
              <DialogContent>
                {t('stock.admin.deletePrompt', <strong>{mapped.code}</strong>)}
              </DialogContent>
            </TplEnhancedDialog>
          </Grid>
        )}
      </Grid>
      <Snackbar
        open={notification.show}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, show: false})}
      />
    </Box>
  );
};

HandsetModelActions.propTypes = {
  mapped: PropTypes.object,
  headers: PropTypes.object,
  onUpdate: PropTypes.func,
};
