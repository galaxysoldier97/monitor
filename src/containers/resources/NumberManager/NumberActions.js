import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DialogContentText, Snackbar } from '@material-ui/core';
import { Assignment, Cancel, Delete, Edit, History } from '@material-ui/icons';
import { TplActionButton, TplEnhancedDialog } from 'mt-react-library/containers/templates';
import { Auth } from '../../../services/Auth';
import { t } from 'mt-react-library/functions';
import { buildNumbersHeaders } from './NumberManagerPage';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import NumberUpdateWizard from './NumberUpdateWizard';
import { ROUTES } from '../../../config/routes';
import { useHistory } from 'react-router-dom';
import TecrepNumberService from '../../../services/resources/TecrepNumberService';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import {StepperProvider} from "../../../components/stepperForm/StepperContext";

export const NumberActions = ({filteredNumber, mapped, onActionPerform}) => {
  const [notification, setNotification] = useState({visible: false, message: ''});
  const history = useHistory();
  const headers = buildNumbersHeaders();

  const edit = number => {
    TecrepNumberService.editNumber(number)
    .then(onActionPerform)
    .catch(e => setNotification({visible: true, message: getErrorMessage(e)}));
  };

  const deleteNumber = number => {
    TecrepNumberService.deleteNumber(number)
    .then(() => {
      if (filteredNumber) {
        history.push(ROUTES.numberManager.path);
      } else {
        onActionPerform();
      }
    })
    .catch(e => setNotification({visible: true, message: getErrorMessage(e, t('numbers.deleteError'))}));
  };

  if (!mapped) {
    return null;
  }

  return (
    <div>
      {!filteredNumber && <TplActionButton tooltipTitle={t('detail')} name="detail" icon={<Assignment />} link={ROUTES.numberInfo.path.replace(':number', mapped.number)} />}
      <TplActionButton tooltipTitle={t('historic.title')} name="historic" icon={<History />} link={ROUTES.historic.path.replace(':entity', 'number').replace(':id', mapped.numberId)} />
      {Auth.connectedUserHasPermission(resourcesScopes.number.edit) &&
      <TplEnhancedDialog
        key={`edit-number-${mapped.numberId}`}
        title={t('number.edit', mapped.number)}
        headers={headers.filter(h => h.editable)}
        cancelProps={{label: t('cancel'), icon: <Cancel />}}
        initialValues={mapped}
        forbiddenValues={{vanityCategory: ['', t('all')], nature: ['', t('all')]}}
        confirmProps={{label: t('edit'), icon: <Edit />, name: 'edit'}}
        showProps={{icon: <Edit />, name: 'edit'}}
        onConfirm={edit}
        autocloseOnConfirm={false}
        tooltipTitle={t('edit')}
      />}
      <StepperProvider>
          <NumberUpdateWizard
            number={mapped}
            onUpdate={onActionPerform}
          />
      </StepperProvider>
      {!filteredNumber && Auth.connectedUserHasPermission(resourcesScopes.number.delete) &&
      <TplEnhancedDialog
        tooltipTitle={t('delete')}
        title={t('number.delete')}
        initialValues={mapped}
        cancelProps={{label: t('cancel'), icon: <Cancel />}}
        confirmProps={{label: t('number.delete'), icon: <Delete />}}
        showProps={{icon: <Delete color="error" />}}
        onConfirm={() => deleteNumber(mapped)}
      >
        <DialogContentText>
          {t('number.delete.ask', <strong>{mapped.number}</strong>)}
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

NumberActions.propTypes = {
  mapped: PropTypes.object,
  onActionPerform: PropTypes.func.isRequired,
  filteredNumber: PropTypes.number,
};
