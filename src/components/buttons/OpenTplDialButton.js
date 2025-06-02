import React, { PropTypes } from 'react';
import { makeStyles } from '@material-ui/styles';
import { TplEnhancedDialog } from 'mt-react-library/containers/templates';
import { DialogContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    }
  },
}));

export const OpenTplDialButton = ({title, headers, confirmProps, cancelProps, showProps, onConfirm, autocloseOnConfirm, closed, dialogProps, dialogContent, validate}) => {
  const classes = useStyles();
  return (
    <div>
      <TplEnhancedDialog
        title={title}
        headers={headers}
        confirmProps={confirmProps}
        cancelProps={cancelProps}
        showProps={{contained: true, ...showProps, className: classes.button}}
        onConfirm={onConfirm}
        autocloseOnConfirm={autocloseOnConfirm}
        dialogProps={dialogProps}
        closed={closed}
        validate={validate}
      >
        {dialogContent ?
          <DialogContent>
            {dialogContent}
          </DialogContent> : null}
      </TplEnhancedDialog>
    </div>
  );
};

OpenTplDialButton.propTypes = {
  title: PropTypes.object,
  headers: PropTypes.array,
  confirmProps: PropTypes.object,
  cancelProps: PropTypes.object,
  showProps: PropTypes.object,
  onConfirm: PropTypes.func,
  autocloseOnConfirm: PropTypes.bool,
  closed: PropTypes.bool,
  dialogProps: PropTypes.object,
  dialogContent: PropTypes.elementType,
  validate: PropTypes.func,
};
