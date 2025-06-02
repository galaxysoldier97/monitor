import React, { PropTypes, useEffect, useState } from 'react';
import PageBase from '../../../components/PageBase';
import { t } from 'mt-react-library/functions';
import { DialogContentText, Grid, Snackbar } from '@material-ui/core';
import { TplEnhancedDialog, TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { ErrorAlert } from '../../../components/ErrorAlert';
import EmptyComponent from '../../../components/EmptyComponent';
import { productsProvisioningHeaders } from '../../../config/service/provisioningTag/productsProvisioningHeaders';
import TecrepProvisioningTagService from '../../../services/services/TecrepProvisioningTagService';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { Auth } from '../../../services/Auth';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { Add, Cancel, Delete } from '@material-ui/icons';
import { getErrorMessage } from '../../../helpers/fetchHelper';

export const ProvisioningProductManagerPage = ({actionId}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [productsProvisioning, setProductsProvisioning] = useState();
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);
  const [pagination, setPagination] = useState({number: 0, size: 10, totalElements: 0});
  const [notification, setNotification] = useState({show: false, message: ''});

  const fetchProductsProvisioning = () => {
    setLoading(true);
    TecrepProvisioningTagService.getProductsProvisioning(actionId, pagination.number, pagination.size)
    .then(response => {
      setProductsProvisioning(response ? response.content : []);
      setPagination({...pagination, totalElements: response.totalElements});
    })
    .catch(err => setError(t('provisioningTag.action.provisioning.fetch.error', err.message)))
    .finally(() => setLoading(false));
  };

  useEffect(fetchProductsProvisioning, [pagination.number, pagination.size]);

  const addProductProvisioning = productProvisioning => {
    setLoading(true);
    TecrepProvisioningTagService.addProductProvisioning(productProvisioning, actionId)
    .then(() => {
      fetchProductsProvisioning();
      setAddedSuccessfully(true);
      setNotification({show: true, message: t('provisioningTag.action.provisioning.added.success')});
      setTimeout(() => setAddedSuccessfully(false), 500);
    })
    .catch(err => {
      setNotification({show: true, message: t('provisioningTag.action.provisioning.added.error', getErrorMessage(err))});
    })
    .finally(() => setLoading(false));
  };

  const deleteProductProvisioning = provisioningProductId => {
    setLoading(true);
    TecrepProvisioningTagService.deleteProductProvisioning(actionId, provisioningProductId)
    .then(() => {
      fetchProductsProvisioning();
      setNotification({show: true, message: t('provisioningTag.action.provisioning.deleted.success')});
    })
    .catch(err => {
      setNotification({show: true, message: t('provisioningTag.action.provisioning.deleted.error', getErrorMessage(err))});
    })
    .finally(() => setLoading(false));
  };

  const deleteDialog = row => <TplEnhancedDialog
    title={t('provisioningTag.action.parameter.delete', row.productCode)}
    confirmProps={{label: t('delete'), icon: <Delete />}}
    cancelProps={{label: t('cancel'), icon: <Cancel />}}
    showProps={{icon: <Delete color="error" />, name: 'delete'}}
    onConfirm={() => deleteProductProvisioning(row.provisioningProductId)}
    tooltipTitle={t('delete')}
  >
    <DialogContentText>
      {t('provisioningTag.action.parameter.delete.ask', <strong>{row.productCode}</strong>)}
    </DialogContentText>
  </TplEnhancedDialog>;

  const productsProvisioningRowMapper = row => {
    const actions = <div key={row.productCode}>
      {Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.delete) && deleteDialog(row)}
    </div>;
    return [{...row, actions}, {}];
  };

  const headers = populateEntityConfiguration(productsProvisioningHeaders);

  const addActionButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.create) &&
    <OpenTplDialButton title={t('add')}
                       key={'add-product-provisioning-' + addedSuccessfully}
                       headers={headers.filter(h => h.addable)}
                       confirmProps={{label: t('add'), icon: <Add />, name: 'confirm_add'}}
                       cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
                       showProps={{icon: <Add />, label: t('add'), name: 'add'}}
                       onConfirm={product => addProductProvisioning(product)}
                       autocloseOnConfirm={false}
                       closed={addedSuccessfully}
    />;

  return (
    <PageBase title={t('provisioningTag.action.provisioning.title')} actionButton={addActionButton}>
      <Grid container>
        {loading ? <Grid item xs={12}><TplLoading /></Grid>
          : <Grid item xs={12}>
            {error ? <ErrorAlert message={error} retry={fetchProductsProvisioning} />
              : productsProvisioning && pagination.totalElements <= 0
                ? <EmptyComponent message={t('list.empty')} marginY={5} />
                : productsProvisioning && <TplEnhancedTable rows={productsProvisioning}
                                                            headers={headers}
                                                            rowMapper={productsProvisioningRowMapper}
                                                            controlled
                                                            pageable
                                                            paginationDefault={pagination}
                                                            onPageChange={setPagination}
              />}
          </Grid>}
      </Grid>
      <Snackbar
        open={notification.show}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({show: false, message: ''})}
      />
    </PageBase>
  );
};

ProvisioningProductManagerPage.propTypes = {
  actionId: PropTypes.string,
};
