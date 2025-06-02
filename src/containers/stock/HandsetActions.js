import React, { PropTypes, useState } from 'react';
import { Box, DialogContentText, Snackbar } from '@material-ui/core';
import { Cancel, Delete, Edit } from '@material-ui/icons';
import { TplEnhancedDialog } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { Auth } from '../../services/Auth';
import { resourcesScopes } from '../../config/resources/resourcesScopes';
import Grid from '@material-ui/core/Grid';
import { deleteHandset, editHandset } from '../../services/Stock/StockManagementService';
import { getErrorMessage } from '../../helpers/fetchHelper';

export const HandsetActions = ({row, headers, onUpdate}) => {
  const [notification, setNotification] = useState({show: false});

  if (!row) {
    return null;
  }

  const updateItem = updatedItem => {
    editHandset(updatedItem)
    .then(onUpdate)
    .catch(err => {
      setNotification({show: true, message: getErrorMessage(err)});
    });
  };

  const deleteItem = item => {
    deleteHandset(item)
    .then(onUpdate)
    .catch(err => {
      setNotification({show: true, message: getErrorMessage(err)});
    });
  };

  return (
    <Box minHeight="3em">
      <Grid container alignItems="center" wrap="nowrap">
          {Auth.connectedUserHasPermission(resourcesScopes.handset.update) &&
            <Grid item>
              <TplEnhancedDialog
                tooltipTitle={t('edit')}
                title={t('stock.handsets.edit', row.imei)}
                headers={headers.filter(h => h.editable)}
                initialValues={{...row, model: row.model.code, warehouse: row.warehouse.code}}
                cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
                confirmProps={{label: t('edit'), icon: <Edit />, name: 'confirm_edit'}}
                showProps={{icon: <Edit />, name: 'edit'}}
                onConfirm={updateItem}
                autocloseOnConfirm={false}
              />
            </Grid>
          }
          {Auth.connectedUserHasPermission(resourcesScopes.handset.delete) &&
            <Grid item>
              <TplEnhancedDialog
                title={t('stock.handsets.delete')}
                initialValues={row}
                confirmProps={{label: t('delete'), icon: <Delete />}}
                cancelProps={{label: t('cancel'), icon: <Cancel />}}
                showProps={{icon: <Delete color="error" />}}
                onConfirm={deleteItem}
                dialogProps={{fullWidth: true, maxWidth: 'sm'}}
                autocloseOnConfirm
                tooltipTitle={t('delete')}
              >
                <DialogContentText>
                  {t('stock.handsets.delete.ask', <strong>{row.imei}</strong>)}
                </DialogContentText>
              </TplEnhancedDialog>
            </Grid>
          }
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

HandsetActions.propTypes = {
  row: PropTypes.object,
  headers: PropTypes.object,
  onUpdate: PropTypes.func,
};
