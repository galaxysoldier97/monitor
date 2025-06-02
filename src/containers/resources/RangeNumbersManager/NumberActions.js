import React, { PropTypes, useState } from 'react';
import { t } from 'mt-react-library/functions';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import LowPriorityIcon from '@material-ui/icons/LowPriority';
import Snackbar from '@material-ui/core/Snackbar';
import { TplEnhancedDialog, TplActionButton } from 'mt-react-library/containers/templates';
import { numberStatusChange } from '../../../config/resources/number/numberStatus';
import TecrepRangeNumbersService from '../../../services/resources/TecrepRangeNumbersService';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { yellow } from '@material-ui/core/colors';

const useStyle = makeStyles(() => ({
  iconButton: {
    "&:disabled": {
      color: yellow[700],
    }
  },
}));

const NumberActions = ({rangeId, number, onRangeAction}) => {
  const classes = useStyle();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({message: '', show: false});

  const changeStatus = data => {
    setIsLoading(true);
    TecrepRangeNumbersService.updateNumberStatus(rangeId, data.status, number.number)
    .then(() => onRangeAction(t('rangeNumbers.details.statusUpdatedSuccessfully')))
    .catch(error => {
      setNotification({message: error.response.data.error || t('rangeNumbers.details.statusUpdateFailed'), show: true});
      setIsLoading(false);
    });
  };

  const onMainNumberChange = () => {
    setIsLoading(true);
    TecrepRangeNumbersService.updateMainNumber(rangeId, number.number)
    .then(() => onRangeAction(t('rangeNumbers.details.mainNumberUpdatedSuccessfully')))
    .catch(err => {
      setNotification(err.response.data.message || err.response.data.error || t('rangeNumbers.updateRangeWizard.updateError'));
      setIsLoading(false);
    });
  };

  return (
    <>
      {isLoading && <Box marginY={2.75}><LinearProgress variant="indeterminate" /></Box>}
      {!isLoading && (
        <div>
            <TplEnhancedDialog
              tooltipTitle={t('change')}
              key={`update-status-${number.numberId}`}
              title={t('rangeNumbers.details.updateNumberStatus')}
              headers={[
                {id: 'status', label: t('number.status'), type: 'enum', values: numberStatusChange.filter(status => status.key && number.events.includes(status.key))},
              ]}
              cancelProps={{label: t('button.cancel'), icon: <CancelIcon />}}
              confirmProps={{label: t('button.submit'), icon: <CheckIcon />}}
              showProps={{icon: <LowPriorityIcon />}}
              onConfirm={changeStatus}
              dialogProps={{fullWidth: true, maxWidth: 'sm'}}
              autocloseOnConfirm={false}
            />
          {number.nature === 'MAIN'
            ? <IconButton className={classes.iconButton} disabled><StarIcon /></IconButton>
            : <TplActionButton name="mainNumber" tooltipTitle={t('rangeNumbers.details.chooseMainNumber')} icon={<StarBorderIcon />} onClick={onMainNumberChange} />
          }
          <Snackbar open={notification.show} message={notification.message} autoHideDuration={4000} onClose={() => setNotification({...notification, show: false})} />
        </div>
      )}
    </>
  );
};

NumberActions.propTypes = {
  rangeId: PropTypes.string,
  number: PropTypes.object,
  onRangeAction: PropTypes.func,
};

export default NumberActions;
