import React, { useCallback, useEffect, useState } from 'react';
import PageBase from '../../../components/PageBase';
import { Box, DialogContentText, Grid, Snackbar } from '@material-ui/core';
import { TplEnhancedDialog, TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import { Add, Cancel, Delete, Edit } from '@material-ui/icons';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { InfoBloc } from '../../../components/InfoBloc';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { postalAddressFields } from '../../../config/adresses/postalAddress/postalAddressFields';
import { externalAddressFields } from '../../../config/adresses/postalAddress/externalAddressFields';
import { useLocation } from 'react-router-dom';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import PostalAddressService from '../../../services/address/PostalAddressService';
import ExternalRefAddressService from '../../../services/address/ExternalRefAddressService';

const buildExternalAddressHeaders = () => populateEntityConfiguration(externalAddressFields);

const getDisplayValue = (item, key) => {
  const switchAddressInfo = {...item.address, ...item.building, ...item.address.street};
  return key in switchAddressInfo ? switchAddressInfo[key] : '';
};

export default function PostalAddressInfoPage(){
  const [item, setItem] = useState({loading: true});
  const location = useLocation();
  const addressId = location.pathname.split('/')[2];
  const [notification, setNotification] = useState({visible: false, message: ''});

  const fetch = useCallback(() => {
    setItem({...item, loading: true, error: undefined});
    PostalAddressService.getPostalAddress(addressId)
    .then(res => setItem({loading: false, data: res}))
    .catch(err => setItem({loading: false, error: getErrorMessage(err)}));
  }, [addressId]);

  useEffect(fetch, [location.key]);

  if (!item.data) {
    return <TplLoading />;
  }

  const externalRefAddressHeaders = buildExternalAddressHeaders();

  const addExternalRefAddress = externRefAddress => {
    ExternalRefAddressService.add(externRefAddress, addressId)
    .then(fetch)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };
  const updateExternalRefAddress = externRefAddress => {
    ExternalRefAddressService.edit(externRefAddress)
    .then(fetch)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };
  const deleteExternalAddress = externRefAddress => {
    ExternalRefAddressService.delete(externRefAddress.externalRefAddressId)
    .then(fetch)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  return (
    <>
      <PageBase
        title={t('postalAddress.detail.title')}
        navigation={t('postalAddress.navigation')}
        backButton>
        <Box
          marginY={4}>
          <Grid
            container
            spacing={2}>
            {postalAddressFields.map(field =>
              field.label !== '' ? (
                <Grid item key={field.id} xs={12} sm={6} md={3}>
                  <InfoBloc
                    label={field.label.props?.id || field.label}
                    value={getDisplayValue(item.data, field.id)}
                  />
                </Grid>
              ) : null
            )}
          </Grid>
        </Box>
      </PageBase>
      <PageBase
        title={t('external.address.title')}
        actionButton={
          <OpenTplDialButton
            title={t('add.external.address')}
            headers={externalRefAddressHeaders.filter(h => h.editable || h.addable)}
            confirmProps={{label: t('add'), icon: <Add />}}
            cancelProps={{label: t('cancel'), icon: <Cancel />}}
            showProps={{icon: <Add />, label: t('add'), name: 'add'}}
            autocloseOnConfirm={false}
            onConfirm={addExternalRefAddress}
          />}>
          <TplEnhancedTable
            rows={item.data.externalRefAddressDTOS}
            headers={externalRefAddressHeaders}
            rowMapper={itemRow => {
              let mapped = {...itemRow};
              mapped.actions = (
                <div>
                  <TplEnhancedDialog
                    tooltipTitle={t('edit')}
                    title={t('edit.external.address')}
                    headers={externalRefAddressHeaders.filter(h => h.editable)}
                    initialValues={mapped}
                    confirmProps={{label: t('edit'), icon: <Edit />}}
                    cancelProps={{label: t('cancel'), icon: <Cancel />}}
                    showProps={{icon: <Edit />}}
                    autocloseOnConfirm={false}
                    onConfirm={updateExternalRefAddress}
                  />
                  <TplEnhancedDialog
                    tooltipTitle={t('delete')}
                    title={t('delete.external.address')}
                    initialValues={itemRow}
                    confirmProps={{label: t('block.delete'), icon: <Delete />}}
                    cancelProps={{label: t('cancel'), icon: <Cancel />}}
                    showProps={{icon: <Delete color="error" />}}
                    autocloseOnConfirm={false}
                    onConfirm={deleteExternalAddress}>
                      <DialogContentText>
                        {t('delete.external.address.ask')}
                      </DialogContentText>
                  </TplEnhancedDialog>
                </div>
              );
              return [mapped, {}];
            }}
            sortable
        />
      </PageBase>
      <Snackbar
        open={notification.visible}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({...notification, visible: false})}
      />
    </>
  );
}
