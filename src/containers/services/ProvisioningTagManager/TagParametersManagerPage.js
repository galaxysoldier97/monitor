import React, { PropTypes, useEffect, useRef, useState } from 'react';
import PageBase from '../../../components/PageBase';
import { DialogContentText, Grid, Snackbar, Typography } from '@material-ui/core';
import { TplEnhancedDialog, TplEnhancedTable, TplLoading } from 'mt-react-library/containers/templates';
import { actionParametersHeader } from '../../../config/service/provisioningTag/actionParametersHeaders';
import { populateEntityConfiguration } from '../../../helpers/entityHelper';
import { Auth } from '../../../services/Auth';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { OpenTplDialButton } from '../../../components/buttons/OpenTplDialButton';
import { Add, Cancel, Delete } from '@material-ui/icons';
import TecrepProvisioningTagService from '../../../services/services/TecrepProvisioningTagService';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import {useTranslation} from "react-i18next";

const TagParametersManagerPage = ({actionId, actionParameters, fetchTagAction}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({show: false, message: ''});
  const [dialogMessage, setDialogMessage] = useState();
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);
  const technicalParameters = useRef([]);

  useEffect(() => {
    TecrepProvisioningTagService.getTagParameterCodes()
    .then(response => {
      if (response._embedded && response._embedded.technicalParameterDToes) {
        response._embedded.technicalParameterDToes.forEach(item => technicalParameters.current.push({key: item, value: item.parameterCode}));
      }
    })
    .catch(() => setDialogMessage(t('provisioningTag.action.parameter.list.error')));
  }, []);

  const rows = actionParameters?.map(action => ({parameterValue: action.parameterValue, ...action.technicalParameter}));

  const headers = populateEntityConfiguration(actionParametersHeader, {parameterCode: technicalParameters.current});

  const addActionParameter = actionParameter => {
    setLoading(true);
    TecrepProvisioningTagService.addActionParameter(actionId, actionParameter.parameterCode, actionParameter.parameterValue)
    .then(() => {
      fetchTagAction();
      setAddedSuccessfully(true);
      setNotification({show: true, message: t('provisioningTag.action.parameter.added.success')});
      setTimeout(() => setAddedSuccessfully(false), 500);
    })
    .catch(err => {
      setNotification({show: true, message: t('provisioningTag.action.parameter.added.error', getErrorMessage(err))});
    })
    .finally(() => setLoading(false));
  };

  const deleteActionParameter = parameterId => {
    setLoading(true);
    TecrepProvisioningTagService.deleteActionParameter(actionId, parameterId)
    .then(() => {
      fetchTagAction();
      setNotification({show: true, message: t('provisioningTag.action.parameter.deleted.success')});
    })
    .catch(err => {
      setNotification({show: true, message: t('provisioningTag.action.parameter.deleted.error', getErrorMessage(err))});
    })
    .finally(() => setLoading(false));
  };

  const deleteDialog = row => <TplEnhancedDialog
    tooltipTitle={t('delete')}
    title={t('provisioningTag.action.parameter.delete', row.parameterCode)}
    confirmProps={{label: t('delete'), icon: <Delete />}}
    cancelProps={{label: t('cancel'), icon: <Cancel />}}
    showProps={{icon: <Delete color="error" />, name: 'delete'}}
    onConfirm={() => deleteActionParameter(row.parameterId)}
  >
    <DialogContentText>
      {t('provisioningTag.action.parameter.delete.ask', <strong>{row.parameterCode}</strong>)}
    </DialogContentText>
  </TplEnhancedDialog>;

  const actionParametersRowMapper = row => {
    const actions = <div key={row.parameterId}>
      {Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.delete) && deleteDialog(row)}
    </div>;
    return [{...row, actions}, {}];
  };

  const addParameterButton = Auth.connectedUserHasPermission(resourcesScopes.servicesAdmin.create) &&
    <OpenTplDialButton title={t('add')}
                       key={'add-tag-action-parameter-' + addedSuccessfully}
                       headers={headers.filter(h => h.addable)}
                       confirmProps={{label: t('add'), icon: <Add />, name: 'confirm_add'}}
                       cancelProps={{label: t('cancel'), icon: <Cancel />, name: 'cancel'}}
                       showProps={{icon: <Add />, label: t('add'), name: 'add'}}
                       validate={value => !value.parameterCode ? {parameterCode: t('provisioningTag.action.parameter.parameterCode.error')} : {}}
                       onConfirm={actionParameter => addActionParameter(actionParameter)}
                       dialogContent={dialogMessage && <Typography variant="caption" color="error">{dialogMessage}</Typography>}
                       autocloseOnConfirm={false}
                       closed={addedSuccessfully}
    />;

  return (
    <PageBase title={t('provisioningTag.action.parameter.title')} actionButton={addParameterButton}>
      <Grid container>
        {loading ? <Grid item xs={12}><TplLoading /></Grid>
          : <Grid item xs={12}>
            <TplEnhancedTable rows={rows}
                              headers={headers}
                              rowMapper={actionParametersRowMapper}
            />
          </Grid>}
      </Grid>
      <Snackbar
        id="popup"
        open={notification.show}
        message={notification.message}
        autoHideDuration={4000}
        onClose={() => setNotification({show: false, message: ''})}
      />
    </PageBase>
  );
};

TagParametersManagerPage.propTypes = {
  actionParameters: PropTypes.arrayOf(PropTypes.object),
  actionId: PropTypes.string,
  fetchTagAction: PropTypes.function,
};

export default TagParametersManagerPage;
