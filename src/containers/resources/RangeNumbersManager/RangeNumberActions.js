import React, { PropTypes, useState } from 'react';
import { Box, DialogContentText, IconButton, Snackbar } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import CheckIcon from '@material-ui/icons/Check';
import HistoryIcon from '@material-ui/icons/History';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ROUTES } from '../../../config/routes';
import { yesNoFilter } from '../../../config/yesNoFilter';
import { TplEnhancedDialog, TplActionButton } from 'mt-react-library/containers/templates';
import { t } from 'mt-react-library/functions';
import TecrepRangeNumbersService from '../../../services/resources/TecrepRangeNumbersService';
import UpdateRangeWizard from './UpdateRangeWizard';
import { Auth } from '../../../services/Auth';
import { Edit } from '@material-ui/icons';
import { resourcesScopes } from '../../../config/resources/resourcesScopes';
import { rangeNumbersFields } from '../../../config/resources/rangeNumbers/rangeNumbersFields';
import { getErrorMessage } from '../../../helpers/fetchHelper';
import {StepperProvider} from "../../../components/stepperForm/StepperContext";

const RangeNumberActions = ({range, detailsPage, onRangeAction}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({message: '', show: false});

  const createRange = newRange => {
    const params = {
      continuousRange: newRange.continuousRange,
      extendedRange: true,
      mainRangeId: range.rangeId,
    };
    TecrepRangeNumbersService.create(params)
    .then(() => onRangeAction(t('rangeNumbers.createSuccessful')))
    .catch(err => setNotification({show: true, message: t('rangeNumbers.createFailed', getErrorMessage(err))}));
  };

  const deleteRange = () => {
    setIsLoading(true);
    TecrepRangeNumbersService.delete(range.rangeId)
    .then(() => onRangeAction(t('rangeNumbers.deletedSuccessfully')))
    .catch(() => {
      setNotification({message: t('rangeNumbers.deleteFailed'), show: true});
      setIsLoading(false);
    });
  };

  const editRange = item => {
    TecrepRangeNumbersService.edit(item)
    .then(() => onRangeAction(t('rangeNumbers.editedSuccessfully')))
    .catch(error => {
      setNotification({
        show: true,
        message: t('rangeNumbers.editFailed', getErrorMessage(error)),
      });
    });
  };

  return (
    <>
      {isLoading && <Box marginY={2.75}><LinearProgress variant="indeterminate" /></Box>}
      {!isLoading && (
        <div>
          {!detailsPage && (
            <TplActionButton tooltipTitle={t("detail")} icon={<AssignmentIcon />} name="detail" link={ROUTES.rangeNumberInfo.path.replace(':rangeNumberId', range.rangeId)} />
          )}
          <TplActionButton tooltipTitle={t("historic.title")} icon={<HistoryIcon />} name="historic" link={ROUTES.historic.path.replace(':entity', 'rangeNumber').replace(':id', range.rangeId)} />
          {Auth.connectedUserHasPermission(resourcesScopes.number.edit) &&
          <TplEnhancedDialog
            tooltipTitle={t('edit')}
            key={`edit-range-${range.rangeId}`}
            title={t('rangeNumbers.edit', range.rangeId)}
            headers={rangeNumbersFields.filter(h => h.editable && h.id !== 'status')}
            forbiddenValues={{extendedRange: ['', t('all')]}}
            initialValues={{
              rangeId: range.rangeId,
              mainRangeId: range.mainRange ? range.mainRange.rangeId : null,
              extendedRange: range.extendedRange ? yesNoFilter[1].key : yesNoFilter[2].key,
              orderId: range.orderId,
            }}
            cancelProps={{label: t('button.cancel'), icon: <CancelIcon />}}
            confirmProps={{label: t('edit'), icon: <Edit />, name: 'edit'}}
            onConfirm={editRange}
            showProps={{icon: <Edit />, name: 'edit'}}
            dialogProps={{fullWidth: true, maxWidth: 'sm'}}
            autocloseOnConfirm={!!detailsPage}
          />}
          <StepperProvider>
            <UpdateRangeWizard range={range} onUpdate={() => onRangeAction(t('rangeNumbers.updateRangeWizard.updateSuccess'))} />
          </StepperProvider>
          {Auth.connectedUserHasPermission(resourcesScopes.number.edit) &&
          (range.extendedRange
              ? <IconButton disabled><PlaylistAddIcon /></IconButton>
              : (
                <TplEnhancedDialog
                  tooltipTitle={t("rangeNumbers.createExtendedRange")}
                  key={`create-service-${range.rangeId}`}
                  title={t('rangeNumbers.create')}
                  headers={[{
                    id: 'continuousRange',
                    label: t('rangeNumbers.continuousRange'),
                    type: 'enum',
                    required: true,
                    values: yesNoFilter.filter(f => !!f.key),
                  }]}
                  validate={values => values.continuousRange !== undefined ? {} : {continuousRange: t('requiredField')}}
                  cancelProps={{label: t('button.cancel'), icon: <CancelIcon />}}
                  confirmProps={{label: t('button.submit'), icon: <CheckIcon />}}
                  showProps={{icon: <PlaylistAddIcon />}}
                  dialogProps={{fullWidth: true, maxWidth: 'sm'}}
                  onConfirm={createRange}
                  autocloseOnConfirm
                />)
          )}
          {!detailsPage && Auth.connectedUserHasPermission(resourcesScopes.number.delete) && (
            <TplEnhancedDialog
              tooltipTitle={t('delete')}
              key={`delete-service-${range.rangeId}`}
              title={t('rangeNumbers.delete')}
              cancelProps={{label: t('button.cancel'), icon: <CancelIcon />}}
              confirmProps={{label: t('button.delete'), icon: <DeleteIcon />}}
              showProps={{icon: <DeleteIcon color="error" />}}
              onConfirm={deleteRange}
              dialogProps={{fullWidth: true, maxWidth: 'sm'}}
              autocloseOnConfirm={false}
            >
              <DialogContentText>{t('rangeNumbers.confirmDelete', range.rangeId)}</DialogContentText>
            </TplEnhancedDialog>
          )}
          <Snackbar open={notification.show} message={notification.message} autoHideDuration={4000} onClose={() => setNotification({...notification, show: false})} />
        </div>
      )}
    </>
  );
};

RangeNumberActions.propTypes = {
  range: PropTypes.object,
  detailsPage: PropTypes.bool,
  onRangeAction: PropTypes.func,
};

export default RangeNumberActions;
