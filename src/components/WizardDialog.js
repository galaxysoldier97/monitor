import React, { PropTypes, useEffect, useState } from 'react';
import { t } from 'mt-react-library/functions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { ErrorAlert } from './ErrorAlert';

const WizardDialog = (props) => {
  const {
    open,
    onClose,
    setWidth,
    values,
    setValues,
    initialValues,
    shouldDisableNext,
    onSubmit,
    error,
    resetError,
    beforeLoadingPreviousPage,
    beforeLoadingNextPage,
    showNextButton,
    showSubmitButton,
    title,
    children
  } = props;
  const classes = useStyle();
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setPage(1);
        setIsSubmitting(false);
        resetError('');
        setValues(initialValues);
      }, 100);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [open]);

  useEffect(() => {
    setNextDisabled(shouldDisableNext(page));
  }, [page, values]);

  const submit = () => {
    setIsSubmitting(true);
    resetError('');
    onSubmit().then(onClose).catch(() => setIsSubmitting(false));
  };

  const previousPage = () => {
    resetError('');
    setPage(page - 1);
    if (beforeLoadingPreviousPage) {
     beforeLoadingPreviousPage(page);
    }
  };

  const nextPage = () => {
    resetError('');
    setPage(page + 1);
    if (beforeLoadingNextPage) {
     beforeLoadingNextPage(page);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{className: classes.root}}
      maxWidth={setWidth ? setWidth(page) : 'sm'}
      fullWidth
      disableEnforceFocus
      disableBackdropClick>
      <DialogTitle>{title(page)}</DialogTitle>
      <DialogContent>{children(page)}</DialogContent>
      {error && <ErrorAlert message={error} marginY={1} fullWidth />}
      <DialogActions>
        {isSubmitting
          ? <Button variant="text" disabled><CircularProgress size={25} /></Button>
          : (
            <>
              <Button onClick={onClose} startIcon={<CancelIcon/>}>{t('button.cancel')}</Button>
              {page > 1 && (
                <Button onClick={previousPage} color="primary" startIcon={<NavigateBeforeIcon />}>
                  {t('button.previous')}
                </Button>
              )}
              {showNextButton(page) && (
                <Button onClick={nextPage} color="primary" disabled={nextDisabled} endIcon={<NavigateNextIcon />}>
                  {t('button.next')}
                </Button>
              )}
              {showSubmitButton(page) && (
                <Button onClick={submit} color="primary" disabled={nextDisabled} endIcon={<DoubleArrowIcon />}>
                  {t('button.submit')}
                </Button>
              )}
            </>
          )}
      </DialogActions>
    </Dialog>
  );
};

const useStyle = makeStyles({
  root: {
    transition: 'max-width 0.3s',
  },
});

WizardDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setWidth: PropTypes.func,
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  shouldDisableNext: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  resetError: PropTypes.func.isRequired,
  beforeLoadingPreviousPage: PropTypes.func,
  beforeLoadingNextPage: PropTypes.func,
  showNextButton: PropTypes.func.isRequired,
  showSubmitButton: PropTypes.func.isRequired,
  title: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default WizardDialog;
